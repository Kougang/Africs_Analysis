// test_parse_Rochnel.js

let str =
  "020208003b95795ced0f0300018500604255640d02b0001c87f0f5513341030050050b303a0105003032350504303910060340e8361d0004014013030240041d301a050c30e6400c01a0fb82d53d031ba0060640ffffffff0c00a0008088c30400201a0e00d01dc58240a6a51a411a00060c3a010c000010000113000194000095000401200c040520430102000308200407201163";
const latLongPattern = new RegExp("^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}"); // cette expression defini le format de presentation
//des coordonnees gps

// extraction keys
let hexUniqueId = str.split("").splice(8, 16).join("");//divise les donnees str sous forme de string et les frontieres de reperage sont les espace , c’est le role de la fonction split ici commence a l’indice 8 et reccupere les elements de la chaine a partir de l’indice 8 reccuper 16 element, une fois l’operation pris fin la methode join utilise l’espase qui separe les donnees pour les joindre, donc apres cette methode on a ceci comme resultat : b95795ced0f030001

uniqueId ="it_" + parseInt("0x" hexUniqueId.match(/../g).reverse().join("")).toString();
//ox veut dire que la donnee que l’on traite est en hexadecimal, la fonction(match(/../g)) divise notre donnee en bloc de 2 a 2([b9 57 95 ce d0 f0 30 00 ]), la methode rever renverse le tebleau puis join tous les bloc de deux deux renverse pour en faire une chaine chaine, puis la methode toString convertie la donnee de l hexa en entier, puis la met sous forme de string et a ce resultat est concantene ‘it_’ d’où l’obtention du resultat final qui represente la cle primaire, ci-dessous la methode de convertion de la base 16 en e 
console.log("cle unique en entier:",uniqueId);
// match(/../g) divise les elements en deux caracteres ca donne sous forme de tableau de 2 2 caractere,
// reverse() renverse le tableau et la fin devient le debut
let gpsSensorIdentifier =
  str.indexOf("00d0") >= 0 ? str.indexOf("00d0") : str.indexOf("00D0");
if (gpsSensorIdentifier >= 0) {
  let hexlatitude = str
    .split("")
    .splice(gpsSensorIdentifier + 4, 8)
    .join("");
  console.log("hexlatitude", hexlatitude);
  hexlatitude = hexlatitude.match(/../g).reverse().join("");
  
  if (
    latLongPattern.test(Buffer.from(hexlatitude, "hex").readFloatBE(0)) &&
    Buffer.from(hexlatitude, "hex").readFloatBE(0) > 0
  ) {
    GPS_SIGNAL_INDEX = 1; // valeur de event flag, pour dire si une variable existe ou pas, avoir des vehicules online offline
    //no gps
    latitude = Buffer.from(hexlatitude, "hex").readFloatBE(0);
    // obdObj.event.payloadData.latitude = Buffer.from(hexlatitude, 'hex').readFloatBE(0)
    // sensorObj.latitude = Buffer.from(hexlatitude, 'hex').readFloatBE(0)
  }
  let hexlongitude = str
    .split("")
    .splice(gpsSensorIdentifier + 12, 8)
    .join("");
  console.log("hexlongitude", hexlongitude);
  hexlongitude = hexlongitude.match(/../g).reverse().join("");
  if (
    latLongPattern.test(Buffer.from(hexlongitude, "hex").readFloatBE(0)) &&
    Buffer.from(hexlongitude, "hex").readFloatBE(0) > 0
  ) {
    GPS_SIGNAL_INDEX = 1;
    longitude = Buffer.from(hexlongitude, "hex").readFloatBE(0);
    // sensorObj.longitude = Buffer.from(hexlongitude, 'hex').readFloatBE(0)
    // obdObj.event.payloadData.longitude = Buffer.from(hexlongitude, 'hex').readFloatBE(0)
  }
}

console.log("lat long:", latitude, longitude);
