import { initializeApp } from "firebase/app";
// 1) Firebase kimligimizi projeye tanitmis olduk.

// 1) Firebase'in bu mikro kütüphanesi kimlik dogrulama ile ilgili.
import {
  getAuth, // 1) Bir kimlik dogrulama örnegi olusturmak icin getAuth'u cektik.
  signInWithRedirect, // 3)
  signInWithPopup, // 1) birisi yönlendirme ile, öteki acilir pencere ile oturum acmaya yarar.
  GoogleAuthProvider, // 1) bu da google kimlik dogrulama saglayicisi
} from "firebase/auth";

// 1) Firebase'in bu mikro kütüphanesi veritabani ile ilgili.
import {
  getFirestore, // 1) Bir veritabani olusturmak icin getFirestore'u cektik.
  doc, // 1) Bu "doc" metodu sayesinde firestore veritabanımızdaki belgeleri aliriz.
  getDoc, // 1) Peki bu verileri nasıl elde ederiz veya bu verileri bu belgelere nasıl yerleştiririz? İşte, getDoc ve setDoc metoduna ihtiyacınız olan kisim burasıdır.
  setDoc, // 1) Belge verilerini alıyorsak veya set ediyorsak, doc bir belge örneği elde etmek için ihtiyacınız olan şeydir.
  // 1) Ancak bu belgelerdeki verilere erişmek istediğimizde getDoc kullanmamız gerekir.
  // 1) Ve verileri ayarlamak istediğinizde, setDoc'a ihtiyacımız var.
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLjvpulQ7NCwaylNM1zBy1arEfNj0bibU",
  authDomain: "fir-exercise-esadsiz.firebaseapp.com",
  projectId: "fir-exercise-esadsiz",
  storageBucket: "fir-exercise-esadsiz.appspot.com",
  messagingSenderId: "382589735773",
  appId: "1:382589735773:web:1771906974e5185b130eb4",
};

const firebaseApp = initializeApp(firebaseConfig);

// 1) Bu Google kimlik doğrulamasını kullanmak için, önce aldığımız bu GoogleAuthProvider sınıfını kullanarak bir sağlayıcı başlatmamız gerekiyor.
// 1) new GoogleAuthProvider'i cagiririz, bu da bize bir sağlayıcı örneği dönecek.
// 1) Her oturum acma yönteminin saglayicisi, yani provider'i farklidir. Yani Facebook'unki farkli, Google'inki farkli vs.
const provider = new GoogleAuthProvider();
// 1) Bir sonraki adim. custom parameter denilen bu özel parametreler bir tür yapılandırma nesnesi alir ve bu sayede GoogleAuthProvider'ın nasıl davranmasını istediğimizi belirleriz.
// 1) Genel olarak isteyeceğimiz davranis tarzi "prompt"dur. Bu, kisiler sağlayıcımızla her etkileşime girdiğinde, onları her zaman bir hesap seçmeye zorlamis oluruz.
provider.setCustomParameters({
  prompt: "select_account",
});
// 1) Simdi de kimlik doğrulamamızı dışa aktaralim.
export const auth = getAuth();
// 1) Simdi de auth ve provider verilerini göndererek redirect ile giris talep ediyoruz.
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, provider);
// 2) Simdi veritabanimizi olusturalim.
export const db = getFirestore();
// 2) Simdi bunu veritabanımıza erişmek için kullanabiliriz.
// 2) Bu, veritabanımıza bagli bir dosya almak veya ayarlamak istediğimizde Firebase'e haber vermemizi sağlar.

// 2) Simdi bir kullanici dosyasi yaratalim.
// 2) Öncelikle, mevcut bir dosya referansı olup olmadığını görmemiz gerekiyor. Burada referanstan kasit, Firestore'un kullandığı özel bir obje türü.
// 2) doc üç parametre alır. İlk parametre veritabanıdır, burada yarattigimiz Firestore veritabanımizi kullanıyoruz.
// 2) İkincisi koleksiyon olacak. "users" diyelim. Ve üçüncüsü, bir tür tanımlayıcı olacak.
// 2) 1. derste dönen response adinda bir obje vardi. O obje icerisindeki asil ilgilendigimiz şey, ad, e-posta, doğrulanıp doğrulanmadığı, telefon numarası, fotoğraf URL'si, ama en önemlisi, UID adinda bir kimlik var.
// 2) Bu, bu objeyle elde ettiğimiz unique yani benzersiz bir kimlik tanımlayıcısıdır, bu nedenle bu UID'yi unique id olarak da kullanabiliriz.
export const createUserDocumentFromAuth = async (userAuth) => {
  const userDocRef = doc(db, "users", userAuth.uid); // 2) Yani burada yaptigimiz sey, userAuth.uid'yi dosya referansi almak icin unique ID olarak kullanmak.
  // 2) "Hey, bana dosya referansını ver. db isimli veritabanının içinde, userAuth.uid kullanıcı kimliği ile, users koleksiyonunun altında.
  // 2) Bildigimiz gibi, veritabanımızın içinde bir dosya referansımız yok. Bir users koleksiyonumuz bile yok. Ancak yine de Google bu objeyi bizim için oluşturacaktır.
  console.log(userDocRef); // 2)  Bir obje döner. Bu obje veritabanındaki dosya referanslarını temsil eden objedir.
  // 2) Simdi gereken objemizi elde ettigimize göre verileri alma ve kontrol etme sirasi geldi.
  // 2) Bunun icin getDoc kullanacagiz.
  const userSnapshot = await getDoc(userDocRef);
  console.log(userSnapshot); // 2) userSnapShot burada özel bir obje türüne isaret eder. Bu obje türünde bir belgenin var olup olmadigini kontrol etmenin farkli yollari var.
  console.log(userSnapshot.exists()); // 2) exists burada true ya da false döndürür.

  // 2) Simdi verilere eriselim.
  // Kullanici bilgileri mevcut degil mi? O zaman onu veritabanina yerlestir.
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, { displayName, email, createdAt });
      return userDocRef;
    } catch (error) {
      console.log("Error creating the user", error.message);
    }
  }
  // Kullanici bilgileri mevcut mu? O zaman userDocRef'i direkt return et.
  else {
    return userDocRef;
  }

  // 2) Bunlar benim sözlerim; Böylece, giris butonuna tiklayip google ile giris yapmak istenildiginde,
  // 2) veritabanimizda o kisiye ait bilgiler yoksa bile, yani o kullanicinin kimligi veritabanimizda tanimli degilse bile, "sorgulama, bir tane olustur." demis olduk.
  // 2) Firebase'in Firestore Database sekmesinde sonucu görebilirsin.
  // 2) Artık kullanıcılarımızın kimliğini doğrulayabilir, içeri girmelerine izin verebilir, yalnızca bu kimliği doğrulanmış kullanıcılar ve ilgili verileriyle veritabanımızı güncelleyebiliriz.
  // 2) Bu sistem sayesinde artik kullanıcıların uygulamamız içinde hem kimlik doğrulaması hem de depolanması var.
};
