import {
  auth, // 3)
  signInWithGoogleRedirect,
  createUserDocumentFromAuth,
} from "../../utils/firebase/firebase.utils";

import { useEffect } from "react"; // 3)
import { getRedirectResult } from "firebase/auth"; // 3)

const SignIn = () => {
  useEffect(() => {
    const fetchData = async () => {
      const response = await getRedirectResult(auth);
      if (response) {
        const userDocRef = await createUserDocumentFromAuth(response.user); // 3)
        console.log(userDocRef);
      }
      console.log(response);
    };
    fetchData();
  }, []); // Burada bos listenin anlami; "Bu fonksiyonu bir kez calistir, bu komponent ilk kez mount oldugunda."

  // Google Popup'taki gibi yaparsak;
  // const logGoogleRedirectUser = async () => {
  // const response = await signInWithGoogleRedirect();
  // const userDocRef = await createUserDocumentFromAuth(response.user);
  // console.log(userDocRef); // 3) Burada konsolumuzda herhangi bir dönüs olmaz, cünkü butona tikladigimizda, google'in giris sayfasina yönlendiriliriz.
  // 3) Giris islemi tamamlandiktan sonra ise bizi sayfamiza geri getirir. Yani, geri döndüğümüzde, esasen tüm sayfayi baştan sıfırdan başlatmis oluyoruz,
  // 3) Bu da yönlendirme isleminden önce calisir durumda olan herhangi bir fonksiyonun artık yürürlükte olmadığı anlamına geliyor.
  // 3) Bu yüzden burada, useEffect kullanmamiz gerekecek.
  // };

  return (
    <div>
      <button onClick={signInWithGoogleRedirect}>
        {/* Bu kisimda onClick'in ici logGoogleRedirectUser'di. ama burayi direkt signInWithGoogleRedirect'e bagladik. cünkü yukarida bahsettigim gibi yazdigimiz logGoogleRedirectUser fonksiyonu bize hicbir sey dönmüyor.   */}
        <h1>Sign In with Google Redirect</h1>
      </button>
    </div>
  );
};

export default SignIn;
