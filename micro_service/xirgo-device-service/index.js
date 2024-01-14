const mqtt = require("mqtt");
const dotenv = require("dotenv");
dotenv.config();
const DEFAULT_EVENT_FLAG =
  "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";
let MAIN_POWER_INDEX = 0;
let GPS_SIGNAL_INDEX = 0;
let MESSAGE_ID_INDEX = 0;

// si on a u message de la part du broker ou courtier
if (process.env.MQTT_BROKER_URL) {
  /*
  la variable client contiendra l'objet de connexion au broker via le serveur mqtt 
   client.on("connect", async () => {} elle appellera cette fonction fleche en parametre si l'evenement connect est detecte
   */
  let client = mqtt.connect("mqtt://" + process.env.MQTT_BROKER_URL);
  client.on("connect", async () => {
    console.info(
      "Connected to MQTT Broker.",
      client.options.host,
      client.connected
    );
    /*
    if (process.env.TOPICS_LIST) : si un sujet de communication est detecter alors ce if est execute
    dans le if : process.env.TOPICS_LIST.split(",") cette ligne divise les donness en un tableau de string ce qui suppose que
  les donnees arrivent sous forme d une chaine de dans laquelle les elements sont divises par des virgules
  topicsArray est donc un tableau qui contiendra l ensemble des topics ou sujets auquelle un client peut souscrire.
  topicsArray.forEach((element) => {: elle parcour alors chaque topic dans le tableau preccedent et fais souscrire l utilisateur

    */
    if (process.env.TOPICS_LIST) {
      let topicsArray = process.env.TOPICS_LIST.split(",");

      topicsArray.forEach((element) => {
        client.subscribe(element);
        console.info("Subscribed to ", element);
      });
    }

    client.on("message", async (topic, message) => {
      /*
        l objet buffer ici est utiliser pour manipuler les flux de des donnees binaire, ce qui veut dire le parametre message
        emis es convertir en binaire ou en flux brute et est stocker dans la constate buf, idealement si message est une chaine
        de caractere, la constante buf binaire
        str contiendra le codage hexadeimal du contenun de buff par la methode toString("hex") buf est convertit en hexa
        latLongPattern = new RegExp('^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}');: cette ligne instancie la classe RegExp() et cree 
        une instance de cette classe avec des instructions en parametre, en effet ces instruction vont permettre de donner 
        un format sur lequel des donnees doivent si mettre au cas contraire ces donnees seront consideree comme invalide 
      */
      const buf = Buffer.from(message);
      const str = buf.toString("hex");
      const latLongPattern = new RegExp(
        "^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}"
      );

      switch (topic) {
        /* ici un sujet ou topic est pris en parametre et dans le case ci dessous l on verifie si ce topic est semblable a 
        au  paramtere , alors si c est le cas  cela veut dire le string str est recu et c est cette chaine qui contient 
        les donnees que nous allons parser tout au long de notre algorithme pour obtenir les differents attribut de notre payload

        */
        case "BCE/D":
          console.log("Received Payload", str);
          if (str) {
            // initialisation des differentes valeurs du hash payload

            let payloadObj = {
              uniqueId: null,
              timestamp: 1680180853,
              latitude: 0,
              longitude: 0,
              speed: 0,
              isHA: false,
              isHB: false,
              distance: 0,
              event_flag: 4736,
              packetEventCode: 1,
              fl_level: 0,
              gpsStatus: "A",
              gpsSignal: 0,
              direction: 0,
              extBatVol: 0,
              intBatVol: 0,
              satellites: 0,
              HDOP: 0,
              temperature: 0,
              delta_distance: 0,
              xval: 0,
              yval: 0,
              zval: 0,
              altitude: 0,
            };
            //  ci dessous on a un hash de hash de hash et le hash interieur correspond a notre payload avec plusieurs valeurs en surplus, notons que le hash de payload est identifie par une cle event
            let obdObj = {
              event: {
                payloadData: {
                  uniqueId: null,
                  timestamp: 1680195161,
                  latitude: null,
                  longitude: null,
                  extBatVol: null,
                  intBatVol: null,
                  engineLoad: null,
                  tankLevel: null,
                  throttle: null,
                  coolant: null,
                  intakeAirTemp: null,
                  engineOilTemp: null,
                  imap: null,
                  vehicleSpeed: null,
                  warmups: null,
                  rpm: null,
                  obdDistance: null,
                  maf: null,
                  fuelRail: null,
                  runTime: null,
                  mil: null,
                  obdStandards: null,
                  tellTale: null,
                  pto_drive_engagement: null,
                  engine_torque_percent: null,
                  service_distance: null,
                  gross_combination_vehicle_weight: null,
                  selected_gear: null,
                  current_gear: null,
                  fuel_consumption: null,
                  fuel_level: null,
                  fuel_rate: null,
                  fuel_economy: null,
                  accelerator_pedal_pos: null,
                  vehicle_weight: null,
                  air_suspension_pressure_front_axle_left: null,
                  air_suspension_pressure_front_axle_right: null,
                  air_suspension_pressure_rear_axle_left: null,
                  air_suspension_pressure_rear_axle_right: null,
                  state_of_charge: null,
                  battery_pack_voltage: null,
                  battery_total_current: null,
                  battery_total_power: null,
                  odo_distance: null,
                  lamp_status: null,
                  hydraulic_oil_filter: null,
                  air_filter: null,
                  no_charging: null,
                  low_fuel: null,
                  engine_temp_high: null,
                  hydraulic_oil_temp_high: null,
                  water_in_fuel: null,
                  low_oil_pressure: null,
                  roller_speed: null,
                  plusCode: null,
                  vibration_on: null,
                  axle_position: null,
                  tire_position: null,
                  tire_pressure: null,
                  tire_temperature: null,
                  tire_air_leakage_rate: null,
                  tire_sensor_enable_status: null,
                  tire_status: null,
                  tire_sensor_electric_fault: null,
                  extended_tire_pressure_support: null,
                  tire_pressure_threshold_detection: null,
                  extended_tire_pressure: null,
                  cpc_system_type: null,
                  required_tire_pressure: null,
                  cpc_tire_id: null,
                  cpc_graphical_position: null,
                  cpc_tire_location: null,
                  cpc_ttm_id: null,
                  secondary_air_status: null,
                  catalyst_temperature_bank1_sensor1: null,
                  catalyst_temperature_bank1_sensor2: null,
                  barometric_pressure: null,
                  distance_since_mil: null,
                  commanded_egr: null,
                  egr_error: null,
                  drive_cycle_status: null,
                  ambient_air_temperature: null,
                  fuel_system_status: null,
                  short_term_fuel_trim_bank_1: null,
                  long_term_fuel_trim_bank_1: null,
                  timing_advance: null,
                  oxygen_sensors_present: null,
                  oxygen_sensor_1_voltage: null,
                  oxygen_sensor_2_voltage: null,
                  commanded_evaporative_purge: null,
                  control_module_voltage: null,
                  absolute_load_value: null,
                  relative_throttle_position: null,
                  oxygen_sensor_1_short_term_fuel_trim: null,
                  oxygen_sensor_2_short_term_fuel_trim: null,
                  can_raw_data: str,
                  fuel_used: null,
                },
              },
            };
            /*obdObj pour les valeurs des vehicules  en database , recu de leurs capteurs, donc les informations issues de cette objet provienent d'un
            capteur installer sur le vehicule
            payloadObj pour les valeurs des capteurs gps recues*/

            let sensorObj = {
              userId: 0,
              loginTimeStamp: 0,
              logoutTimeStamp: 0,
              loginStatus: 0,
              logoutStatus: 0,
              rfid: "3717367B",
              packetEventCode: 0,
              eventCode: 0,
              isLiveEventCode: false,
              rawString:
                "$$iTriangle1,3529130902164154414,20,4.094121,9.736638,17042022171130,A,1,3717367B,00.0,0,12.2,*58",
              uniqueId: "it_3529130902164154414",
              serialNo: "3529130902164154414",
              date: "2017-04-20",
              time: "22:35:50",
              timestamp: 1680195161,
              latitude: 4.094120979309082,
              callPhpForOldPack: false,
              longitude: 9.736638069152832,
              altitude: 0.0,
              PDOP: 0.0,
              delta_distance: 0.0,
              analog2: 0.0,
              xval: 0,
              yval: 0,
              zval: 0,
            };
            /*uniqueid 
            hexUniqueId est une chaine de donnees en hexa separe par des espaces,donc ci dessous separer la chaine afin d obtenir des sous chaines qui vont
            correspondre aux differentes diffusions du broker alors a la fois on ne traite unechaine a la fois et on parse sea donnees et l enregistre 
            dans le hash ou dictionnaire payload. .splice(8, 16).join(""): signifie que a partir de l indice 8 on compte 16 caracteres et on l eregistre dans 
            hexUniqueId et puis join("")reconstitue la chaine initiale
            'it_' + parseInt("0x" + hexUniqueId.match(/../g).reverse().join("")).toString(): //ox veut dire que la donnee 
            que l’on traite est en hexadecimal, la fonction(match(/../g)) divise notre donnee en bloc de 2 a 2([b9 57 95 ce d0 f0 30 00 ]),
            la methode rever renverse le tebleau puis join tous les bloc de deux deux renverse pour en faire une chaine chaine, 
            puis la methode toString convertie la donnee de l hexa en entier, puis la met sous forme de string et a ce resultat 
            est concantene ‘it_’ d’où l’obtention du resultat final qui represente la cle primaire, ci-dessous la methode de 
            convertion de la base 16 en e 
            match(/../g) divise les elements en deux caracteres ca donne sous forme de tableau de 2 2 caractere,
            reverse() renverse le tableau et la fin devient le debut
            obdObj.event.payloadData.uniqueId: ceci est proportionnel a la definition du hash de trois niveaux defini plus haut 
            event est la cle qui pointe sur le hash dans la cle est payload et qui parmi ces element contient l'element ou l attribut
            uniqueId. la logique est identique a celui du hash sensorObj 
            */
            /*====================================================================================================================
             ====================================================================================================================
            dans les differents cas et la majorite des cas ci dessous la logique de parsing restera la meme. que celle definie
            dans le paragraphe preccedent.
            ====================================================================================================================
            ====================================================================================================================
           */

            let hexUniqueId = str.split("").splice(8, 16).join("");
            payloadObj.uniqueId =
              "it_" +
              parseInt(
                "0x" + hexUniqueId.match(/../g).reverse().join("")
              ).toString();
            obdObj.event.payloadData.uniqueId =
              "it_" +
              parseInt(
                "0x" + hexUniqueId.match(/../g).reverse().join("")
              ).toString();
            sensorObj.uniqueId =
              "it_" +
              parseInt(
                "0x" + hexUniqueId.match(/../g).reverse().join("")
              ).toString();

            //timestamp
            let hexTimestamp = str.split("").splice(30, 8).join("");
            payloadObj.timestamp = parseInt(
              "0x" + hexTimestamp.match(/../g).reverse().join("")
            );
            sensorObj.timestamp = parseInt(
              "0x" + hexTimestamp.match(/../g).reverse().join("")
            );
            obdObj.event.payloadData.timestamp = parseInt(
              "0x" + hexTimestamp.match(/../g).reverse().join("")
            );

            // Sensor No. 1	Sensor_GPS_coordinates (53248)
            // le chiffre entre parenthes est en codification est en little indian, converti en big indian on a 00d0
            //cette ligne retourne l'indexe positionnel de la sous chaine "00d0" si elle est retrouve dans str sinon -1
            let gpsSensorIdentifier =
              str.indexOf("00d0") >= 0
                ? str.indexOf("00d0")
                : str.indexOf("00D0");
            if (gpsSensorIdentifier >= 0) {
              // gpsSensorIdentifier + 4: car la chaine 0d00 tiens sur 4 caracteres il faut depasser ces quatre caracteres pour commencer la reccuperation de la latitude
              let hexlatitude = str
                .split("")
                .splice(gpsSensorIdentifier + 4, 8)
                .join("");
              console.log("hexlatitude", hexlatitude);
              hexlatitude = hexlatitude.match(/../g).reverse().join("");
              // si la valeur de la latitude correspond a la structure predefinie la variable latLongPattern est definie plus haut
              if (
                latLongPattern.test(
                  Buffer.from(hexlatitude, "hex").readFloatBE(0)
                ) &&
                Buffer.from(hexlatitude, "hex").readFloatBE(0) > 0
              ) {
                // incremente pour dire que le vehicule a envoye ses coordonnees
                GPS_SIGNAL_INDEX = 1;
                payloadObj.latitude = Buffer.from(
                  hexlatitude,
                  "hex"
                ).readFloatBE(0);
                obdObj.event.payloadData.latitude = Buffer.from(
                  hexlatitude,
                  "hex"
                ).readFloatBE(0);
                sensorObj.latitude = Buffer.from(
                  hexlatitude,
                  "hex"
                ).readFloatBE(0);
              }
              let hexlongitude = str
                .split("")
                .splice(gpsSensorIdentifier + 12, 8)
                .join("");
              console.log("hexlongitude", hexlongitude);
              hexlongitude = hexlongitude.match(/../g).reverse().join("");
              if (
                latLongPattern.test(
                  Buffer.from(hexlongitude, "hex").readFloatBE(0)
                ) &&
                Buffer.from(hexlongitude, "hex").readFloatBE(0) > 0
              ) {
                GPS_SIGNAL_INDEX = 1;
                payloadObj.longitude = Buffer.from(
                  hexlongitude,
                  "hex"
                ).readFloatBE(0);
                sensorObj.longitude = Buffer.from(
                  hexlongitude,
                  "hex"
                ).readFloatBE(0);
                obdObj.event.payloadData.longitude = Buffer.from(
                  hexlongitude,
                  "hex"
                ).readFloatBE(0);
              }
            }

            // Sensor No. 2	Sensor_Satelites (8193)
            let satellitesIdentifier = str.indexOf("0120");
            if (satellitesIdentifier >= 0) {
              let hexSatellites = str
                .split("")
                .splice(satellitesIdentifier + 4, 2)
                .join("");
              console.log("hexSatellites", hexSatellites);
              payloadObj.satellites = Buffer.from(
                hexSatellites,
                "hex"
              ).readUInt8(0);
            }

            // Sensor No. 3	Sensor_GSM_PWR (8197)
            // le little indian 8197 valeurs decimal converti en big indian donne 0520 qui est la valeurs hexadecimale
            let gsmIdentifier = str.indexOf("0520");
            if (gsmIdentifier >= 0) {
              let hexGSM = str
                .split("")
                .splice(gsmIdentifier + 4, 2)
                .join("");
              console.log("hexGSM", hexGSM);
              payloadObj.gpsSignal = Buffer.from(hexGSM, "hex").readUInt8(0);
            }

            // Sensor No. 4	Sensor_SignalIN5 (19)
            //valeurs d'inition si tu tourne la cle cela emet un signale d inition on si on tourne la cle pour le demarrage
            // et si tu tournes la cle dans le sens d arret du contact du vehicul cela emet une valeurs d inition off
            let ignitionStatusIdentifier = str.indexOf("1300");
            if (ignitionStatusIdentifier >= 0) {
              let hexIgnitionStatus = str
                .split("")
                .splice(ignitionStatusIdentifier + 4, 2)
                .join("");
              console.log("hexIgnitionStatus", hexIgnitionStatus);
              let event_flag = 0;
              if (
                parseInt(
                  "0x" + hexIgnitionStatus.match(/../g).reverse().join("")
                ) < 10
              ) {
                console.log("hexIgnitionStatus", hexIgnitionStatus);
                // parseInt(hexIgnitionStatus, 16) ici on specifie que l nombre a convertir en entier est en base 16 et toString(2) specifie que le nombre soit converti en binaire
                // donc dans eventFlagString: on a soit 1 ou 0
                let eventFlagString = createEventFlagString(
                  parseInt(hexIgnitionStatus, 16).toString(2)
                );
                for (let i = 31; i >= 0; i--) {
                  event_flag <<= 1;
                  if ("1" == eventFlagString[i]) {
                    event_flag |= 0x1;
                  }
                }
              } else {
                console.log("hexIgnitionStatus");
                ignitionStatusIdentifier = str.indexOf(
                  "1300",
                  ignitionStatusIdentifier + 1
                );
                hexIgnitionStatus = str
                  .split("")
                  .splice(ignitionStatusIdentifier + 4, 2)
                  .join("");
                console.log("hexIgnitionStatus", hexIgnitionStatus);

                let eventFlagString = createEventFlagString(
                  parseInt(hexIgnitionStatus, 16).toString(2)
                );
                for (let i = 31; i >= 0; i--) {
                  event_flag <<= 1;
                  if ("1" == eventFlagString[i]) {
                    event_flag |= 0x1;
                  }
                }
              }
              //les valeurs initions on et inition off ont ete formate pour etre stockee dans  le drapeau event_flag de payload sous forme de 0 ou 1 ou true or false
              payloadObj.event_flag = event_flag;
            }

            // Sensor No. 5	Sensor_VCC (12288)
            // information sur le voltage de la machine interne de la machine
            let extBattVolIdentifier = str.indexOf("0030");
            if (extBattVolIdentifier >= 0) {
              let hexExtBatVol = str
                .split("")
                .splice(extBattVolIdentifier + 4, 4)
                .join("");
              console.log("hexExtBatVol", hexExtBatVol);
              if (Buffer.from(hexExtBatVol, "hex").readUInt16LE(0) < 1000) {
                extBattVolIdentifier = str.indexOf(
                  "0030",
                  extBattVolIdentifier + 1
                );
                hexExtBatVol = str
                  .split("")
                  .splice(extBattVolIdentifier + 4, 4)
                  .join("");
                payloadObj.extBatVol = Buffer.from(
                  hexExtBatVol,
                  "hex"
                ).readUInt16LE(0);
              }
              payloadObj.extBatVol = Buffer.from(
                hexExtBatVol,
                "hex"
              ).readUInt16LE(0);
              obdObj.event.payloadData.extBatVol = Buffer.from(
                hexExtBatVol,
                "hex"
              ).readUInt16LE(0);
              MAIN_POWER_INDEX = 1;
            }

            // Sensor No. 6	Sensor_VBAT (12292)
            // information sur le vaoltage interne du vehicule
            let intBattVolIdentifier = str.indexOf("0430");
            if (intBattVolIdentifier >= 0) {
              let hexIntBatVol = str
                .split("")
                .splice(intBattVolIdentifier + 4, 4)
                .join("");
              console.log("hexIntBatVolt", hexIntBatVol);
              payloadObj.intBatVol = Buffer.from(
                hexIntBatVol,
                "hex"
              ).readUInt16LE(0);
              obdObj.event.payloadData.intBatVol = Buffer.from(
                hexIntBatVol,
                "hex"
              ).readUInt16LE(0);
            }

            // Sensor No. 7	Sensor_Distance (45058)
            let distanceIdentifier =
              str.indexOf("02b0") >= 0
                ? str.indexOf("02b0")
                : str.indexOf("02B0");
            if (distanceIdentifier >= 0) {
              let hexDistance = str
                .split("")
                .splice(distanceIdentifier + 4, 16)
                .join("");
              console.log("hexDistance", hexDistance);
              payloadObj.distance = Math.fround(
                Buffer.from(hexDistance, "hex").readDoubleLE(0)
              );
              obdObj.event.payloadData.obdDistance = payloadObj.distance;
              payloadObj.delta_distance = payloadObj.distance;
            }

            // Sensor No. 8	Sensor_Course (12299)
            let courseIdentifier =
              str.indexOf("0b30") >= 0
                ? str.indexOf("0b30")
                : str.indexOf("0B30");
            if (courseIdentifier >= 0) {
              let hexCourse = str
                .split("")
                .splice(courseIdentifier + 4, 16)
                .join("");
              console.log("hexCourse", hexCourse);
              // payloadObj. = Math.fround(Buffer.from(hexCourse, 'hex').readUInt16LE(0))
            }

            // Sensor No. 9	Sensor_GPS_speed (8192)
            // informations sur la vitesse de l engin
            let speedIdentifier = str.indexOf("0020");
            if (speedIdentifier >= 0) {
              let hexSpeed = str
                .split("")
                .splice(speedIdentifier + 4, 2)
                .join("");
              console.log("hexSpeed", hexSpeed);
              payloadObj.speed = Buffer.from(hexSpeed, "hex").readUInt8(0);
            }

            // Sensor No. 10	Sensor_SignalMotion (2) - Still don't know where it is being used
            let signalMotionIdentifier = str.indexOf("9400");
            if (signalMotionIdentifier >= 0) {
              let hexSignalMotion = str
                .split("")
                .splice(signalMotionIdentifier + 4, 2)
                .join("");
              console.log("hexSignalMotion", hexSignalMotion);
            }

            // Sensor No. 11	Sensor_OUT1 (148) - Still don't know where it is being used
            let out1Identifier = str.indexOf("9400");
            if (out1Identifier >= 0) {
              let hexOut1 = str
                .split("")
                .splice(out1Identifier + 4, 2)
                .join("");
              console.log("hexOut1", hexOut1);
            }

            // Sensor No. 12	Sensor_TotalDistance (16387)
            let totalDistanceIdentifier = str.indexOf("0340");
            if (totalDistanceIdentifier >= 0) {
              let hexTotalDistance = str
                .split("")
                .splice(totalDistanceIdentifier + 4, 8)
                .join("");
              console.log("hexTotalDistance", hexTotalDistance);
              obdObj.event.payloadData.odo_distance = Math.round(
                Buffer.from(hexTotalDistance, "hex").readUInt32LE(0) * 0.005
              );
            }

            // Sensor No. 13	Sensor_TotalFuelUsed (16385)
            let totalFuelUsedIdentifier = str.indexOf("0140");
            if (totalFuelUsedIdentifier >= 0) {
              let hexTotalFuelUsed = str
                .split("")
                .splice(totalFuelUsedIdentifier + 4, 8)
                .join("");
              console.log("hexTotalFuelUsed", hexTotalFuelUsed);
              obdObj.event.payloadData.fuel_used =
                Buffer.from(hexTotalFuelUsed, "hex").readUInt32LE(0) * 0.5;
            }

            // Sensor No. 14	Sensor_TotalEngineHours (16386)
            let totalEngineHoursIdentifier = str.indexOf("0240");
            if (totalEngineHoursIdentifier >= 0) {
              let hexTotalEngineHours = str
                .split("")
                .splice(totalEngineHoursIdentifier + 4, 8)
                .join("");
              console.log("hexTotalEngineHours", hexTotalEngineHours);
              obdObj.event.payloadData.runTime = Math.round(
                Buffer.from(hexTotalEngineHours, "hex").readUInt32LE(0) * 0.05
              );
            }

            // Sensor No. 15	Sensor_WheelSpeed (12317)
            let wheelSpeedIdentifier =
              str.indexOf("1d30") >= 0
                ? str.indexOf("1d30")
                : str.indexOf("1D30");
            if (wheelSpeedIdentifier >= 0) {
              let hexWheelSpeed = str
                .split("")
                .splice(wheelSpeedIdentifier + 4, 4)
                .join("");
              console.log("hexWheelSpeed=", hexWheelSpeed);
              obdObj.event.payloadData.roller_speed =
                Buffer.from(hexWheelSpeed, "hex").readUInt16LE(0) / 256;
            }

            // Sensor No. 16	Sensor_RPM (12300)
            let rpmIdentifier =
              str.indexOf("0c30") >= 0
                ? str.indexOf("0c30")
                : str.indexOf("0C30");
            if (rpmIdentifier >= 0) {
              let hexRPM = str
                .split("")
                .splice(rpmIdentifier + 4, 4)
                .join("");
              console.log("hexRPM=", hexRPM);
              obdObj.event.payloadData.rpm =
                Buffer.from(hexRPM, "hex").readUInt16LE(0) * 0.125;
            }

            // Sensor No. 17	Sensor_Acceleration (40961)
            let accelerationIdentifier =
              str.indexOf("01a0") >= 0
                ? str.indexOf("01a0")
                : str.indexOf("01A0");
            if (accelerationIdentifier >= 0) {
              let hexAcceleration = str
                .split("")
                .splice(accelerationIdentifier + 4, 8)
                .join("");
              console.log("hexAcceleration=", hexAcceleration);
              // obdObj.event.payloadData.fuel_consumption = Math.round(Buffer.from(hexAcceleration, 'hex').readFloatLE(0))
            }

            // Sensor No. 18	Sensor_EngineTemperature (8200)
            // temperature du vehicule
            let temperatureIdentifier = str.indexOf("0820");
            if (temperatureIdentifier >= 0) {
              let hexTemperature = str
                .split("")
                .splice(temperatureIdentifier + 4, 2)
                .join("");
              console.log("hexTemperature", hexTemperature);
              payloadObj.temperature = Buffer.from(
                hexTemperature,
                "hex"
              ).readUInt8(0);
            }

            // Sensor No. 19	Sensor_FuelInstant (40987)
            let fuelConsumptionIdentifier =
              str.indexOf("1ba0") >= 0
                ? str.indexOf("1ba0")
                : str.indexOf("1BA0");
            if (fuelConsumptionIdentifier >= 0) {
              let hexFuelConsumption = str
                .split("")
                .splice(fuelConsumptionIdentifier + 4, 8)
                .join("");
              console.log("hexFuelConsumption=", hexFuelConsumption);
              obdObj.event.payloadData.fuel_consumption = Math.round(
                Buffer.from(hexFuelConsumption, "hex").readFloatLE(0)
              );
            }

            // Sensor No. 20	Sensor_U32UserDefined1 (16390) & Sensor No. 21	Sensor_Ibutton_ID (20480) give the same result
            let rfidIdentifier = str.indexOf("0640");
            if (rfidIdentifier >= 0) {
              let hexRFID = str
                .split("")
                .splice(rfidIdentifier + 4, 8)
                .join("");
              console.log("hexRFID", hexRFID);
              sensorObj.rfid = Buffer.from(hexRFID, "hex").readUInt32LE(0);
              //sensorObj.rfid = hexRFID
            }

            // Sensor No. 22	Sensor_SignalIN2 (16)
            let panicButtonIdentifier = str.indexOf("1000");
            if (panicButtonIdentifier >= 0) {
              let hexPanicButton = str
                .split("")
                .splice(panicButtonIdentifier + 4, 2)
                .join("");
              console.log("hexPanicButton", hexPanicButton);
              MESSAGE_ID_INDEX = Buffer.from(hexPanicButton, "hex").readUInt8(
                0
              );
            }

            // Sensor No. 23	Sensor_FuelLevel1 (8199)
            // sans me tromper je crois que ceci indique le niveau d'essence dans le vehicule
            let fuelLevelIdentifier = str.indexOf("0720");
            if (fuelLevelIdentifier >= 0) {
              let hexFuelLevel = str
                .split("")
                .splice(fuelLevelIdentifier + 4, 2)
                .join("");
              console.log("hexFuelLevel", hexFuelLevel);
              payloadObj.fl_level = Buffer.from(hexFuelLevel, "hex").readUInt8(
                0
              );
            }

            console.log("Payload=", obdObj);
            client.publish(
              process.env.PUBLISH_TOPIC,
              JSON.stringify(payloadObj)
            );

            client.publish(
              process.env.PUBLISH_TOPIC_OBD,
              JSON.stringify(obdObj)
            );

            client.publish(
              process.env.PUBLISH_TOPIC_SENSOR,
              JSON.stringify(sensorObj)
            );
          }
          break;

        default:
          console.log("Topic Changed=", topic);
          break;
      }
    });
  });
} else {
  console.log("MQTT VARIABLES NOT SET!");
}

const createEventFlagString = (msg) => {
  let str = DEFAULT_EVENT_FLAG;
  let eventStringFlag = str.split(",");
  console.log("MSG=", msg, GPS_SIGNAL_INDEX, MAIN_POWER_INDEX);
  eventStringFlag[10] = msg;
  eventStringFlag[12] = msg == "0" ? "1" : "0";
  eventStringFlag[7] = MAIN_POWER_INDEX == "0" ? "0" : "1"; // Main power status
  eventStringFlag[8] = MESSAGE_ID_INDEX == "1" ? "1" : "0"; // Panic or Emergency Event)
  eventStringFlag[9] = GPS_SIGNAL_INDEX == "0" ? "1" : "0"; // NO GPS bit
  return eventStringFlag;
};
