function mySettings(props) {
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
    
  {color: '#00163a'},
  {color: '#21003a'},
  {color: '#3a1d00'},
  {color: '#969696'}, 
  {color: '#494949'}, 
  {color: '#2d2d2d'}

];
  return (
    <Page>
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
      ]}
      />
      
      <Toggle
         settingsKey="isHeartbeatAnimation"
         label="Heartbeat animation"
      />
      
      <Toggle
         settingsKey="isAmPm"
         label="AM/PM indication on 12-hour clock"
      />
      
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
        title="Background color">
        <ColorSelect
          settingsKey="backgroundColor"
          colors={colorSet} />
      </Section>
         
    </Page>
    
  );
}

registerSettingsPage(mySettings);