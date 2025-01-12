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

<img src=https://github.com/user-attachments/assets/49d37de9-8a20-4f6e-be70-3657349a3870 width=500>

<img src=https://github.com/user-attachments/assets/bb7e065e-b631-429c-bafb-b8944d7b2795 width=500>

<img src=https://github.com/user-attachments/assets/270419bb-41ef-43c8-b647-b3be4e58e73b width=500>

<img src=https://github.com/user-attachments/assets/ec3d6a0a-4274-4413-a48a-08f362bef55a width=500>


## Design

### Users

SafeBike is primarly aimed to be used by people living and working around London who own and regularly use bicycles to travel around the city. The MPS Crime Data used to power the application only covers London, therefore other cities are not currently supported.

### Wireframes

![Bicycle Theft Presentation](https://github.com/user-attachments/assets/ff066d7b-9667-46cb-8328-bdf8e02e782c)

![Bicycle Theft Presentation (1)](https://github.com/user-attachments/assets/3906a8bf-b211-41fd-b728-0320924f1cb8)

![Bicycle Theft Presentation (2)](https://github.com/user-attachments/assets/ef24c31a-5476-4efd-8b71-ad5ff78a87c0)

![Bicycle Theft Presentation (3)](https://github.com/user-attachments/assets/36f8e13e-26a9-46cc-aa62-59505f781f03)

![Bicycle Theft Presentation (4)](https://github.com/user-attachments/assets/14fe1580-3078-4886-9846-3f776e2213ba)

## Installation

### Prerequisites
Ensure you have the following installed on your system:
- **Node.js**
- **npm** 
- **Docker** 

### Steps to Install Locally
1. Clone the repository:
    ```bash
   git clone https://github.com/ethmacc/casa0017-web-assessment-SafeBike
2. Navigate to the project directory and set up the :
    ```bash
    cd casa0017-web-assessment-SafeBike
3. Install dependencies using npm:
    ```bash
    npm install
4. Add config.js:
    ```bash
    ## go to this path
    cd .\casa0017-web-assessment\Website\src\ 
    ##create the config.js and API key
    touch config.js  ##also can create manually
5. Add API key to config.js:  
    1. Visit the [OpenRoute](https://openrouteservice.org/).
    2. Sign up for an account or log in if you already have one.
    3. Follow the instructions on the website to generate an API token.
    4. Copy the generated API token.
    5. Replace `'You own API Token'` in the `config.js` file with your actual token.

    ```bash
    export const API_TOKEN = 'You own API Token';
6. Go to Website path folder:
    ```bash
    cd .\casa0017-web-assessment\Website
7. Run the website Locally in terminal:
    ```bash
    ## Run this command in terminal
    npm run dev
    ## Terminal will display like:
     VITE v6.0.3  ready in 209 ms

    ➜  Local:   http://localhost:5173/
    ➜  Network: use --host to expose
    ➜  press h + enter to show help
8. Go to Local address web page(here is http://localhost:5173/)
##  Our Team
<a href="https://github.com/ethmacc/casa0017-web-assessment/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=ethmacc/casa0017-web-assessment" />
</a>
