import { MODE } from "../common/mode";

function mySettings(props) {
  let screenWidth = props.settingsStorage.getItem("screenWidth");
  let screenHeight = props.settingsStorage.getItem("screenHeight");
  let modelName = props.settingsStorage.getItem("modelName"); //"Ionic" "Versa "Versa Lite"
  
  let colorSet = [
    {color: "#FF00FF"},   
    {color: "#FFFF00"},  
    {color: "#00FFFF"},  
    {color: "#FF0000"},  
    {color: "#00FF00"},  
    {color: "#0000FF"},  

    {color: "white"} ,
    {color: 'black'},
    {color: 'cornsilk'},
    {color: 'gold'},
    {color: 'aquamarine'},
    {color: 'deepskyblue'},

    {color: 'teal'},
    {color: 'violet'},
    {color: 'midnightblue'},
    {color: 'yellowgreen'},
    {color: 'crimson'},
    {color: 'lightseagreen'},

    {color: 'salmon'},
    {color: '#00FA9A'},  
    {color: 'darkred'},  
    {color: 'darkslategrey'},      
    {color: 'darkorchid'},
    {color: 'darkorange'},

    {color: 'lightsteelblue'},
    {color: 'skyblue'},
    {color: '#8B4513'},
    {color: 'khaki'}, 
    {color: 'palegoldenrod'},  
    {color: 'navy'},

    {color: 'deeppink'},
    {color: 'royalblue'},
    {color: 'orangered'},
    {color: 'greenyellow'}, 
    {color: 'tomato'},  
    {color: 'forestgreen'},

    {color: '#00163a'},
    {color: '#21003a'},
    {color: '#3a1d00'},
    {color: '#969696'}, 
    {color: '#494949'}, 
    {color: '#2d2d2d'}
  ];

  let ccOptions = [
    {name:"Bitcoin (BTC)",  value: "btc"},
    {name:"Ethereum (ETH)", value: "eth"},
    {name:"Litecoin (LTC)", value: "ltc"},
    {name:"Ripple (XRP)",   value: "xrp"},   
    {name:"Stellar Lumens (XLM)",  value: "xlm"}  
  ];  
  
  let goalTypes = [];
  
  goalTypes.push({name:"NONE", value: "NONE"});
  goalTypes.push({name:"Steps", value: "steps"});
  goalTypes.push({name:"Distance", value: "distance"});
  if (modelName != "Versa Lite") {
    goalTypes.push({name:"Elevation", value: "elevationGain"});
  }
  goalTypes.push({name:"Calories", value: "calories"});
  goalTypes.push({name:"Active Minutes", value: "activeMinutes"});  
   
  let exerciseTypes = [
    {value:"run", name:"Run"},
    {value:"walk", name:"Walk"},
    {value:"hiking", name:"Hiking"},
    {value:"cycling", name:"Cycling"},
    {value:"golf", name:"Golf"},   
    {value:"workout", name:"Workout"},
    {value:"weights", name:"Weights"},
    {value:"treadmill", name:"Treadmill"},  
    {value:"circuit-training", name:"Circuit"},
    {value:"yoga", name: "Yoga"},
    {value:"pilates", name: "Pilates"},   
    {value:"elliptical", name: "Elliptical"},
    {value:"spinning", name: "Spinning"},
    {value:"stair-climber", name: "Stair climber"},
    {value:"bootcamp", name: "Bootcamp"},
    {value:"kickboxing", name: "Kickboxing"},
    {value:"tennis", name: "Tennis"},    
    {value:"martial-arts", name: "Martial arts"}
  ]
  
  return (
    <Page>
      <Select
      label="Language"
      settingsKey="language"
      options={[
        {value:"en", name:"English"},
        {value:"de", name:"German"},
        {value:"nl", name:"Dutch"},
        {value:"it", name:"Italian"},
        {value:"fr", name:"French"},
        {value:"es", name:"Spanish"},
        {value:"nb", name:"Norwegian"},
        {value:"sv", name:"Swedish"},        
        {value:"hu", name:"Hungarian"},
        {value:"pl", name:"Polish"},
        {value:"uk", name:"Ukrainian"},
        {value:"ru", name:"Russian"},      
        {value:"zh", name:"Chinese"},
        {value:"ja", name:"Japanese"},          
        {value:"ko", name:"Korean"},   
        {value:"sw", name:"Swahili"}
      ]}
      />
            
      <Select
      label="Date Format"
      settingsKey="dateFormat"
      options={[
        {value:"DD.MM", name:"Monday 31.12"},
        {value:"MM.DD", name:"Monday 12.31"},
        {value:"SW DD.MM", name:"Mon 31.12"},
        {value:"SW MM.DD", name:"Mon 12.31"},
        {value:"SW DD SM", name:"Mon 31 Dec"},
        {value:"SW DD LM", name:"Mon 31 December"},
        {value:"DD LM", name:"31 December"}
      ]}
      />
      
      <Select
      label="Distance unit"
      settingsKey="distanceUnit"
      options={[
        {name:"meters", value:"m"},
        {name:"kilometers", value:"km"},
        {name:"feet", value:"ft"},
        {name:"miles", value:"mi"},
        {name:"yards", value:"yd"}          
      ]}
      />
      
      <Select
        label="Speed/Pace unit"
        settingsKey="speedUnit"
        options={[
          {value:"s", name:"Speed: Distance unit / second"},
          {value:"m", name:"Speed: Distance unit / minute"},
          {value:"h", name:"Speed: Distance unit / hour"},
          {value:"pace", name:"Pace: time / Distance unit"},
        ]}
      />   
      
      <Select
        label="Speed type"
        settingsKey="speedType"
        options={[
          {value:"current", name: "Current"},
          {value:"average", name: "Average"},
          {value:"max", name: "Maximum"}           
        ]}
      />   
      
      <Toggle
         settingsKey="isShowSeconds"
         label="Show Seconds"
      />
      
      <Toggle
         settingsKey="isShowDistanceUnit"
         label="Show Distance Unit label"
      />
            
      <Toggle
         settingsKey="isShowStepsProgress"
         label="Show steps per current hour"
      />
      
      <Toggle
         settingsKey="isBluetoothIndicator"
         label="Show Bluetooth status"
      />
            
      <Toggle
         settingsKey="is12hourClock"
         label="12-hour clock"
      />
      
      <Toggle
         settingsKey="isAmPm"
         label="AM/PM indication (12-hour clock only)"
      />
      
      <Toggle
         settingsKey="isShowRestingBpm"
         label="Show resting heart rate"
      />
      
      <Section title="Exercises">   
        <Toggle
         settingsKey="isExercise"
         label="Enable exercise mode"
        />     
        
        <Toggle
         settingsKey="isGps"
         label="Use GPS when possible"
        />   
        
        <Select
        label="Exercise type 1"
        settingsKey="exerciseType1"
        options={exerciseTypes}
        />  
        
        <Select
        label="Exercise type 2"
        settingsKey="exerciseType2"
        options={exerciseTypes}
        />     
        
        <Select
        label="Exercise type 3"
        settingsKey="exerciseType3"
        options={exerciseTypes}
        />     
        
        {(modelName != "Ionic") && <Select
        label="Exercise type 4"
        settingsKey="exerciseType4"
        options={exerciseTypes}
        />}     
        
      </Section>  
      
      <Section title="Goals">   
        <Select
          label="Goal 1"
          settingsKey="goal0"
          options={goalTypes}
        />
        <Select
          label="Goal 2"
          settingsKey="goal1"
          options={goalTypes}
        />
        <Select
          label="Goal 3"
          settingsKey="goal2"
          options={goalTypes}
        />
        <Select
          label="Goal 4"
          settingsKey="goal3"
          options={goalTypes}
        />
        {(modelName != "Ionic") && <Select
          label="Goal 5"
          settingsKey="goal4"
          options={goalTypes}
        />}       
      </Section>  
      
      <Section title="Cryptocurrencies">   
        <Toggle
         settingsKey="isShowCc"
         label="Show Cryptocurrencies"
        />   
        <Toggle
         settingsKey="isVibrationOnCcErRefresh"
         label="Vibration on refresh"
        />
        <Select
        label="Auto refresh interval (when the screen is on)"
        settingsKey="autoRefreshIntervalCc"
        options={[
          {value:"1", name:"1 minute"},
          {value:"3", name:"3 minutes"},
          {value:"5", name:"5 minutes"},
          {value:"10", name:"10 minutes"},
          {value:"20", name:"20 minutes"},
          {value:"30", name:"30 minutes"},
          {value:"45", name:"45 minutes"}            
        ]}
        />
        <Select
          label="Left CC"
          settingsKey="leftCc"
          options={ccOptions}
        />
        <Select
          label="Right CC"
          settingsKey="rightCc"
          options={ccOptions}
        />
        
        <Select
        label="Show price in currency"
        settingsKey="referenceCurrencyCc"
        options={[
          {value:"USD", name:"USD"},
          {value:"EUR", name:"EUR"},
          {value:"CAD", name:"CAD"},
          {value:"AUD", name:"AUD"},
          {value:"JPY", name:"JPY"},
          {value:"HKD", name:"HKD"},
          {value:"ISK", name:"ISK"},
          {value:"PHP", name:"PHP"},
          {value:"DKK", name:"DKK"},
          {value:"HUF", name:"HUF"},
          {value:"CZK", name:"CZK"},
          {value:"RON", name:"RON"},
          {value:"SEK", name:"SEK"},
          {value:"IDR", name:"IDR"},
          {value:"INR", name:"INR"},
          {value:"BRL", name:"BRL"},
          {value:"RUB", name:"RUB"},
          {value:"HRK", name:"HRK"},
          {value:"THB", name:"THB"},
          {value:"CHF", name:"CHF"},
          {value:"SGD", name:"SGD"},
          {value:"PLN", name:"PLN"},
          {value:"BGN", name:"BGN"},
          {value:"TRY", name:"TRY"},
          {value:"CNY", name:"CNY"},
          {value:"NOK", name:"NOK"},
          {value:"NZD", name:"NZD"},
          {value:"ZAR", name:"ZAR"},
          {value:"MXN", name:"MXN"},
          {value:"ILS", name:"ILS"},
          {value:"GBP", name:"GBP"},
          {value:"KRW", name:"KRW"},
          {value:"MYR", name:"MYR"} 
        ]}
        />
        
        <Text>Prices are taken from Kraken exchange.</Text>
        <Text>Non-USD prices are derived from USD prices using exchangeratesapi.io.</Text>
        <Text>For a manual refresh, tap on a screen (not faster than once in 15 seconds).</Text>
        <Text>Max age of the data displayed: 1 hour.</Text>       
      </Section>      

      <Section title="CC Logos color">
        <ColorSelect
          settingsKey="ccLogosColor"
          colors={colorSet} />
      </Section>
      
      <ImagePicker
        title="Background Image"
        description="Pick an image to use as your background."
        label="Pick a Background Image"
        sublabel="Select a Background color to reset"
        settingsKey="backgroundImage"
        imageWidth={ screenWidth }
        imageHeight={ screenHeight }
      />
      
      <Section
        title="Background color">
        <ColorSelect
          settingsKey="backgroundColor"
          colors={colorSet} />
      </Section>
      
      <Section
        title="Time color">
        <ColorSelect
          settingsKey="timeColor"
          colors={colorSet} />
      </Section>
      
      <Section
        title="Date color">
        <ColorSelect
          settingsKey="dateColor"
          colors={colorSet} />
      </Section>
      
      <Section
        title="Steps color">
        <ColorSelect
          settingsKey="stepsColor"
          colors={colorSet} />
      </Section>
      
      <Section
        title="Distance color">
        <ColorSelect
          settingsKey="distanceColor"
          colors={colorSet} />
      </Section>
       
      <Section
        title="Elevation color">
        <ColorSelect
          settingsKey="elevationGainColor"
          colors={colorSet} />
      </Section>
       
      <Section
        title="Calories color">
        <ColorSelect
          settingsKey="caloriesColor"
          colors={colorSet} />
      </Section>
      
      <Section
        title="Active Minutes color">
        <ColorSelect
          settingsKey="activeMinutesColor"
          colors={colorSet} />
      </Section>
      
      <Section
        title="Heart color">
        <ColorSelect
          settingsKey="heartColor"
          colors={colorSet} />
      </Section>
      
      <Section
        title="Other labels color">
        <ColorSelect
          settingsKey="otherLabelsColor"
          colors={colorSet} />
      </Section>
                  
      <Section
        title="About">
        <Text>
          AcidClock is free, ads-free and open-source. Made in Ukraine.
        </Text>
        <Link source="https://github.com/anha1/fitbit-acidclock">Source code on GitHub</Link>
        <Link source="https://live.blockcypher.com/btc/address/15psz93USaEUrkdhmZDH5tmYywvHLJ75zx">Bitcoin tip jar</Link>
        <Link source="https://etherscan.io/address/0x96BDD795aAcAe880AbB9E3f8AA9153BFfd3d026D">Ethereum tip jar</Link>
        <Link source="https://live.blockcypher.com/ltc/address/LTtfQuChmcwVptF98WZeJbUdGJW3TuNxn3">Litecoin tip jar</Link>
      </Section>         
    </Page>    
  );
}

registerSettingsPage(mySettings);