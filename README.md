# CASA0017 Web Assessment - SafeBike

## Contents

- [About](#about)
- [Design](#design)
- [Showcase](#showcase)
- [Installation](#Installation)
- [Our Team](#our-team)

## About

**SafeBike** is a web application that visualizes bike theft crime statistics in London. The application uses a data-driven backend powered by Node.js, and interactively displays historic data on bike theft incidents from the London Metropolitan Police. Users can use the filtering functions to view the number of bike theft cases broken down by Lower layer Super Output Areas (LSOAs) over a period of 24 months. Users can also use the routing function to plot a route through London that displays the safest places to park their bikes at their destination.

### Data Sources

- APIs: OSM overpass, CycleStreets
- MPS Recorded Crime: Geographic Breakdown - MPS LSOA Level Crime (most recent 24 months), 24 months (https://data.london.gov.uk/dataset/recorded_crime_summary)
- LSOA 2021 boundaries (https://data.london.gov.uk/dataset/statistical-gis-boundary-files-london)

The MPS Crime Data contains data for all types of crime over the past 24 months. Therefore, it was necessary to filter the data to remove everything except bike theft incidents. This was done using a Jupyter notebook, which can be found in ```Website/data_processing```, which was also used to merge the filtered data with the geographic boundaries for each LSOA. The merged data was then output as a .geojson file for use with Maplibre and Deck.gl.

## Showcase

Placeholder 1 (Home)

![image](https://github.com/user-attachments/assets/344421da-93c3-47ea-be1b-254b34e85dca)

Placeholder 2 (App)

![image](https://github.com/user-attachments/assets/d043b0a9-dd1f-42ab-876b-d6f4204c7314)

Placeholder 3 (Routing?)

![image](https://github.com/user-attachments/assets/53ee011c-95df-4ca3-9561-13be36254856)

## Design

### Users

SafeBike is primarly aimed to be used by people living and working around London who own and regularly use bicycles to travel around the city. The MPS Crime Data used to power the application only covers London, therefore other cities are not currently supported.

### Wireframes

![Bicycle Theft Presentation](https://github.com/user-attachments/assets/ff066d7b-9667-46cb-8328-bdf8e02e782c)

![Bicycle Theft Presentation (1)](https://github.com/user-attachments/assets/3906a8bf-b211-41fd-b728-0320924f1cb8)

![Bicycle Theft Presentation (2)](https://github.com/user-attachments/assets/ef24c31a-5476-4efd-8b71-ad5ff78a87c0)

![Bicycle Theft Presentation (3)](https://github.com/user-attachments/assets/bcb8b633-23ef-4a59-a26b-e5364be04356)

![Bicycle Theft Presentation (4)](https://github.com/user-attachments/assets/14fe1580-3078-4886-9846-3f776e2213ba)

## Installation

Include a section that gives intructions on how to install the app or run it in Docker.  What versions of the plugins are you assuming?  Maybe define a licence as well, this is good practise.

##  Our Team
<a href="https://github.com/ethmacc/casa0017-web-assessment/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=ethmacc/casa0017-web-assessment" />
</a>
