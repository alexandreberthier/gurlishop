import {defineStore} from "pinia";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "firebase/auth"
import {auth, db} from "@/config/firebaseConfig";
import {computed, ref} from "vue";
import {useRouter} from "vue-router";
import {User} from "@/models/User";
import type {UserDTO} from "@/models/User";
import type {Order} from "@/models/User";
import type {DeliveryData, PersonalData} from "@/models/User";
import type {Ref} from "vue";
import {doc, setDoc, getDoc, updateDoc, addDoc, collection, getDocs} from "firebase/firestore";


export const useAuthStore = defineStore('auth', () => {

    const router = useRouter()

    const user: Ref<User | null> = ref(null)
    const isLoading: Ref<boolean> = ref(false)
    const errorMessage: Ref<string> = ref('')
    const successMessage: Ref<string> = ref('')

    const isAdmin = computed(() => {
        return user.value?.role === 'admin';
    });

    const adminOrders: Ref<Order[]> = ref([]);

    const isLoggedIn = computed(() => !!user.value && isInitialized.value);

    function register(email: string, password: string) {
        isLoading.value = true;

        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const newUser = new User(
                    userCredential.user.uid,
                    {email: userCredential.user.email || ''}, // E-Mail setzen
                    undefined,
                    'user',
                    new Date()
                );
                user.value = newUser;
                const userDocRef = doc(db, "users", user.value.uid);
                return setDoc(userDocRef, user.value.toDto());
            })
            .then(() => {
                router.push({name: 'user'});
                successMessage.value = 'Erfolgreich registriert';
            })
            .catch(error => {
                errorMessage.value = error.message;
            })
            .finally(() => {
                isLoading.value = false;
            });
    }


    function login(email: string, password: string) {
        isLoading.value = true;

        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const firebaseUser = userCredential.user;
                const userDocRef = doc(db, "users", firebaseUser.uid);

                return getDoc(userDocRef).then(userDoc => {
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        user.value = User.fromDto(data as any);
                    } else {
                        user.value = new User(
                            firebaseUser.uid,
                            {email: firebaseUser.email || ''},
                            undefined,
                            'user',
                            new Date()
                        );
                    }
                });
            })
            .then(() => {
                if (!isAdmin.value) {
                    router.push({name: 'user'})
                } else {
                    router.push({name: 'admin'})
                }

                successMessage.value = 'Erfolgreich eingeloggt';
            })
            .catch(error => {
                errorMessage.value = error.message;
            })
            .finally(() => {
                isLoading.value = false;
            });
    }


    function saveOrder(order: Order) {
        if (!user.value) {
            errorMessage.value = 'Benutzer ist nicht angemeldet.';
            return;
        }

        const userDocRef = doc(db, "users", user.value.uid);
        const ordersCollectionRef = collection(db, "orders");

        // Füge die Bestellung zur Benutzer-Liste hinzu
        const updatedOrders = [...(user.value.orders || []), order];

        // Speichere Bestellung in der 'orders'-Sammlung
        addDoc(ordersCollectionRef, {
            ...order,
            userId: user.value.uid, // Benutzer-ID speichern
        })
            .then(() => {
                return updateDoc(userDocRef, {orders: updatedOrders});
            })
            .then(() => {
                user.value!.orders = updatedOrders; // Lokale Daten aktualisieren
                successMessage.value = 'Bestellung erfolgreich gespeichert.';
            })
            .catch((error) => {
                errorMessage.value = `Fehler beim Speichern der Bestellung: ${error.message}`;
            });
    }


    const isInitialized: Ref<boolean> = ref(false);

    function watchUser() {
        isInitialized.value = false;

        onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                getDoc(userDocRef)
                    .then(userDoc => {
                        if (userDoc.exists()) {
                            const data = userDoc.data() as UserDTO;
                            user.value = User.fromDto(data);
                        } else {
                            user.value = new User(firebaseUser.uid, {email: firebaseUser.email || ''});
                        }
                    })
                    .catch(error => {
                        errorMessage.value = `Fehler beim Abrufen der Benutzerdaten: ${error.message}`;
                    })
                    .finally(() => {
                        isInitialized.value = true; // Auth fertig initialisiert
                    });
            } else {
                user.value = null;
                isInitialized.value = true; // Auth fertig initialisiert
            }
        });
    }


    function logout() {
        isLoading.value = true;

        signOut(auth)
            .then(() => {
                user.value = null;
                router.push({name: 'home'})
                    .then(() => {
                        successMessage.value = 'Erfolgreich abgemeldet.';
                    })
                    .catch(error => {
                        errorMessage.value = `Fehler bei der Navigation: ${error.message}`;
                    });
            })
            .catch(error => {
                errorMessage.value = error.message;
            })
            .finally(() => {
                isLoading.value = false;
            });
    }

    function fetchUserOrders() {
        if (!user.value) {
            errorMessage.value = 'Benutzer ist nicht angemeldet.';
            return;
        }

        const userDocRef = doc(db, "users", user.value.uid);

        isLoading.value = true;

        getDoc(userDocRef)
            .then(userDoc => {
                if (userDoc.exists()) {
                    const data = userDoc.data() as UserDTO;
                    user.value!.orders = data.orders || [];
                    successMessage.value = 'Bestellungen erfolgreich abgerufen.';
                } else {
                    user.value!.orders = [];
                    successMessage.value = 'Keine Bestellungen gefunden.';
                }
            })
            .catch(error => {
                errorMessage.value = `Fehler beim Abrufen der Bestellungen: ${error.message}`;
            })
            .finally(() => {
                isLoading.value = false;
            });
    }


    function fetchAllOrders() {
        if (!user.value || user.value.role !== 'admin') {
            errorMessage.value = 'Nur Admins können alle Bestellungen einsehen.';
            return;
        }

        const ordersCollectionRef = collection(db, "orders");

        isLoading.value = true;

        getDocs(ordersCollectionRef)
            .then(querySnapshot => {
                console.log('Abgerufene Dokumente:', querySnapshot.docs.map(doc => doc.data()));
                const allOrders = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        items: data.items || [],
                        totalAmount: data.totalAmount || 0,
                        status: data.status || 'pending',
                        createdAt: data.createdAt.toDate(),
                        updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
                        trackingNumber: data.trackingNumber || null,
                    } as Order;
                });

                adminOrders.value = allOrders;
                successMessage.value = 'Alle Bestellungen erfolgreich abgerufen.';
            })
            .catch(error => {
                errorMessage.value = `Fehler beim Abrufen der Bestellungen: ${error.message}`;
            })

            .finally(() => {
                isLoading.value = false;
            })
    }

    function updateUserInfo(updatedData: Partial<{ personalData: PersonalData; deliveryData: DeliveryData }>) {
        // Überprüfen, ob der Benutzer existiert
        if (!user.value) {
            errorMessage.value = 'Benutzer ist nicht angemeldet.';
            return;
        }

        // Sicherstellen, dass user.value nicht null ist
        const userDocRef = doc(db, "users", user.value.uid);

        isLoading.value = true;

        updateDoc(userDocRef, updatedData)
            .then(() => {
                // Lokale Benutzerinformationen aktualisieren
                if (updatedData.personalData) {
                    user.value!.personalData = {
                        ...user.value!.personalData, // Bestehende Daten behalten
                        ...updatedData.personalData // Neue Daten hinzufügen/überschreiben
                    };
                }
                if (updatedData.deliveryData) {
                    user.value!.deliveryData = {
                        ...user.value!.deliveryData, // Bestehende Daten behalten
                        ...updatedData.deliveryData // Neue Daten hinzufügen/überschreiben
                    };
                }

                successMessage.value = 'Daten erfolgreich aktualisiert.';
            })
            .catch(error => {
                errorMessage.value = `Fehler beim Aktualisieren der Daten: ${error.message}`;
            })
            .finally(() => {
                isLoading.value = false;
            });
    }


    return {
        register,
        login,
        updateUserInfo,
        fetchUserOrders,
        fetchAllOrders,
        user,
        isLoading,
        successMessage,
        errorMessage,
        watchUser,
        logout,
        isLoggedIn,
        isAdmin,
        adminOrders,
        isInitialized,
        saveOrder
    }

})