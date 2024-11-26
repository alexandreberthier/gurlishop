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

    const adminOrders: Ref<Order[]> = ref([]);

    const isLoggedIn = computed(() => {
        return !!user.value
    })

    function register(email: string, password: string) {
        isLoading.value = true;

        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const newUser = new User(
                    userCredential.user.uid,
                    {email: userCredential.user.email || ''},
                    undefined,
                    'user',
                    new Date()
                )
                user.value = newUser;
                const userDocRef = doc(db, "users", user.value.uid);
                return setDoc(userDocRef, user.value.toDto());
            })
            .then(() => {
                router.push({name: 'user'})
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
                router.push({name: 'user'})
                successMessage.value = 'Erfolgreich eingeloggt';
            })
            .catch(error => {
                errorMessage.value = error.message;
            })
            .finally(() => {
                isLoading.value = false;
            });
    }


    function watchUser() {
        onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser && (!user.value || user.value.uid !== firebaseUser.uid)) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                getDoc(userDocRef)
                    .then(userDoc => {
                        if (userDoc.exists()) {
                            const data = userDoc.data() as UserDTO;
                            user.value = User.fromDto(data);
                        } else {
                            user.value = new User(firebaseUser.uid, { email: firebaseUser.email || '' });
                        }
                    })
                    .catch(error => {
                        errorMessage.value = `Fehler beim Abrufen der Benutzerdaten: ${error.message}`;
                    });
            } else {
                user.value = null;
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

    function updateUserInfo(updatedData: Partial<{ personalData: PersonalData; deliveryData: DeliveryData }>) {
        if (!user.value) {
            errorMessage.value = 'Benutzer ist nicht angemeldet.';
            return;
        }

        const userDocRef = doc(db, "users", user.value.uid);

        isLoading.value = true;

        updateDoc(userDocRef, updatedData)
            .then(() => {
                if (updatedData.personalData) {
                    user.value!.personalData = {...user.value!.personalData, ...updatedData.personalData};
                }
                if (updatedData.deliveryData) {
                    user.value!.deliveryData = {...user.value!.deliveryData, ...updatedData.deliveryData};
                }

                successMessage.value = 'Daten erfolgreich aktualisiert.';
            })
            .catch(error => {
                errorMessage.value = `Fehler beim Aktualisieren der Daten: ${error.message}`;
            })
            .finally(() => {
                isLoading.value = false;
            })
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
                    const data = userDoc.data();
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
                const allOrders = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        items: data.items,
                        totalAmount: data.totalAmount,
                        status: data.status,
                        createdAt: data.createdAt.toDate(),
                        updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
                        trackingNumber: data.trackingNumber || undefined
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
    }

})