import { MODE } from "../common/mode";

function mySettings(props) {
  let screenWidth = props.settingsStorage.getItem("screenWidth");
  let screenHeight = props.settingsStorage.getItem("screenHeight");
  
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
  
  let goalTypes = [
    {name:"NONE",  value: "NONE"},
    {name:"Steps",  value: "steps"},
    {name:"Distance",  value: "distance"},
    {name:"Elevation",  value: "elevationGain"},
    {name:"Calories",  value: "calories"},
    {name:"Active Minutes",  value: "activeMinutes"},   
  ];
  
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
        {name:"DD.MM", value:"DD.MM"},
        {name:"MM.DD", value:"MM.DD"}   
      ]}
      />
      
      <Select
      label="Distance Unit"
      settingsKey="distanceUnit"
      options={[
        {name:"meters", value:"m"},
        {name:"kilometers", value:"km"},
        {name:"feet", value:"ft"},
        {name:"miles", value:"mi"},
        {name:"yards", value:"yd"}          
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
         settingsKey="isAmPm"
         label="AM/PM indication on 12-hour clock"
      />
      
      <Toggle
         settingsKey="isShowRestingBpm"
         label="Show resting hearth rate"
      />
      
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
        <Select
          label="Goal 5"
          settingsKey="goal4"
          options={goalTypes}
        />
        
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
          label="Left CC"
          settingsKey="leftCc"
          options={ccOptions}
        />
        <Select
          label="Right CC"
          settingsKey="rightCc"
          options={ccOptions}
        />
        <Text>Prices are shown in USD and are taken from Kraken exchange.</Text>
        <Text>For a manual refresh, tap on a screen (not faster than once in 30 seconds).</Text>
        <Text>Auto refresh attempt: once in 10 min (when the screen is on).</Text>
        <Text>Max age of the data displayed: 30 min.</Text>       
      </Section>      

      <Section title="CC Logos color">
        <ColorSelect
          settingsKey="ccLogosColor"
          colors={colorSet} />
      </Section>

      <Section
        title="About">
        <Text>
          AcidClock is free, ads-free and open-source. Made in Ukraine.
        </Text>
        <Link source="https://github.com/anha1/fitbit-acidclock">Source code on GitHub</Link>
        <Link source="https://live.blockcypher.com/btc/address/15psz93USaEUrkdhmZDH5tmYywvHLJ75zx/">Bitcoin tip jar</Link>
        <Link source="https://etherscan.io/address/0x96BDD795aAcAe880AbB9E3f8AA9153BFfd3d026D">Ethereum tip jar</Link>
      </Section>         
    </Page>    
  );
}

registerSettingsPage(mySettings);