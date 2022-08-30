import { Component, createSignal, For } from 'solid-js';
import { 
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td, 
  Grid, 
  GridItem,
  Switch,
  VStack,
  Alert,
  AlertIcon,
  Heading,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
} from "@hope-ui/solid"

import Papa from 'papaparse';

// import logo from './logo.svg';
import styles from './App.module.css';

const expectedHeaders = [
  "Location Name",
  "Title",
  "Subtitle",
  "Motto",
  "Address 1",
  "Address 2",
  "City/Town",
  "State/Province",
  "Postal Code",
  "Country",
  "Phone Number",
  "Fax Number",
  "Email",
  "Category"	,
  "Primary Thumbnail",
  "Primary Thumbnail Alt-Text",
  "Primary Logo",
  "Primary Logo Alt-Text",
  "Secondary Thumbnail",
  "Secondary Thumbnail Alt-Text",
  "Secondary Logo",
  "Secondary Logo Alt-Text"
];

type PhoneNumber = {
  number: string
}

type Location = {
  name      : string
  address1  ?: string,
  address2  ?: string,
  city      ?: string
  country   ?: string
  email     ?: string
  fax       ?: PhoneNumber
  motto     ?: string
  phone     ?: PhoneNumber
  state     ?: string
  subtitle  ?: string
  title     ?: string
  zip       ?: string
  [key: string]: any
}

type Task = {
  location: {
    body: Location
    display: []
  }
  [key: string]: any
}


const App: Component = () => {

  const [getData, setData] = createSignal([] as any);
  const [getTableHeaders, setTableHeaders] = createSignal([] as string[]);
  const [getTableRows, setTableRows] = createSignal([] as unknown[][]);

  const handleInputFile = async (e: Event) => {
    const file = ((e.target as HTMLInputElement).files as FileList)[0] as File;

    //return if not a csv
    if (file.type !== "text/csv") return;
    
    // get the text
    const csvText = await file.text();
    
    // get the data
    const data = Papa.parse(csvText, {header: true}).data;
    // return if there is no data
    if (!Array.isArray(data)) {
      return console.error("invalid csv");
    }

    // get the headers
    const headers = Object.keys(data[0]);

    // check/warn for missing headers
    const headersNotFoundInImport = expectedHeaders.filter(h => !headers.includes(h));
    console.log(headersNotFoundInImport);

    // build the tasks
    const tasks = data.map((location) => {
      // for each task, the first task is to import the location
      function subtaskLocation(location: any) {

        const body: Location = {
          name: location["Location Name"],
        }
        const display = [
          {key: "Location Name", value: location["Location Name"]}
        ];

        const mapping: {} = {
          "Address 1": "address1",
          "Address 2": "address2",
          "City/Town": "city",
          "Country": "country",
          "Email": "email",
          "Fax Number": "fax",
          "Motto": "motto",
          "Phone Number": "phone",
          "State/Province": "state",
          "Subtitle": "subtitle",
          "Title": "title",
          "Postal Code": "zip",
        }

        Object.keys(mapping).forEach((header) => {
          const value = location[header];

          if (!value || !mapping[header as keyof typeof mapping]) {
            return;
          };

          body[mapping[header as keyof typeof mapping]] = value;

          display.push({key: header, value: value});

        });

        return {title: "Location Setup", body, display}
      }

      return {location: subtaskLocation(location)};
    })

    setData(tasks);
    console.log(tasks);
  }


  return (
    <Grid class={styles.App}
      h="100vh" 
      templateColumns="repeat(2, 1fr)" 
      templateRows="repeat(5, 1fr)" 
    >
      <GridItem area="1 / 1 / 2 / 2">
        <Input paddingTop="$1" type="file" size="md" oninput={(e) => handleInputFile(e)}/>
        <Alert status="info">
          <AlertIcon mr="$2_5" />
          <VStack>
            <p><a href="#">Click here</a> for an example data sheet</p>
            <p>File must be .csv whith proper headers</p>
          </VStack>
        </Alert>
      </GridItem>

      <GridItem area="2 / 1 / 4 / 2"> 
        <VStack>
          <Heading>Options:</Heading>
          <Switch labelPlacement={"end"} >Switch 1</Switch>
          <Switch labelPlacement={"end"} >Switch 1</Switch>
          <Switch labelPlacement={"end"} >Switch 1</Switch>
          <Switch labelPlacement={"end"} >Switch 1</Switch>
        </VStack>
      </GridItem>

      <GridItem area="4 / 1 / 6 / 3">
        <Table dense highlightOnHover striped='odd'>
          <Thead>
            <Tr>
              <For each={getTableHeaders()} fallback={<div>No items</div>}>
                {(header, index) => <Th data-index={index()}>{header}</Th>}
              </For>
            </Tr>
          </Thead>
          <Tbody>
              <For each={getTableRows()}>
                {(row, i) => {
                  return (
                    <Tr data-index={i}>
                      <For each={row}>
                        {(cell, j) => <Td data-index={j}>{cell as string}</Td>}
                      </For>
                    </Tr>
                  )
                }}
              </For>
          </Tbody>
        </Table>
      </GridItem>

      <GridItem area="1 / 2 / 4 / 3">
        <Heading>
          Import
        </Heading>
        <Accordion>
          <For each={getData()}>
            {(task: Task, i) => {
              return (
                <AccordionItem data-index={i}>
                  <h2>
                    <AccordionButton>
                      <span>{task.location.body.name}</span>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel>
                    <Accordion>
                      <For each={Object.keys(task)}>
                        {(subtask: any, j) => {
                          return(
                            <AccordionItem data-index={j}>
                              <h3>
                                <AccordionButton>
                                  <span>{task[subtask].title}</span>
                                  <AccordionIcon />
                                </AccordionButton>
                              </h3>
                              <AccordionPanel>

                              </AccordionPanel>
                            </AccordionItem>
                          )
                        }}
                      </For>
                    </Accordion>
                  </AccordionPanel>
                </AccordionItem>
              )
            }}
          </For>
        </Accordion>
        <Button>
          Import
        </Button>
      </GridItem>
    </Grid>
  );
};

export default App;

/**
we want to break every row up into tasks

create location

 * 
 * 
 */
/**
 *
 * 
 ["Location Name",
 "Title",
 "Subtitle",
 "Motto",
 "Address 1",
 "Address 2",
 "City/Town",
 "State/Province",
 "Postal Code",
 "Country",
 "Phone Number",
 "Fax Number",
 "Email",
 "Category"	,
 "Primary Thumbnail",
 "Primary Thumbnail Alt-Text"	,
 "Primary Logo",
 "Primary Logo Alt-Text",
 "Secondary Thumbnail",
 "Secondary Thumbnail Alt-Text",
 "Secondary Logo",
 "Secondary Logo Alt-Text"]

address1: "940 Gnatty Creek Road"
address2: null
category_id: 2
city: "North Franklin"
country: "US"
created_at: "2022-06-27T18:12:28.339Z"
domain_settings: []
email: "ashwood@fwsd.org"
fax: {number: "8602220015"}
group_ids: null
id: 25
logo_alt_text: "moar kitteh"
logo_image: {alt_text: "moar kitteh", bytes: 11321,…}
mobile_app_group_ids: null
mobile_calendar_group_ids: null
motto: "Better Tools, Stronger Schools"
name: "Ashwood High School"
phone: {number: "8602220006"}
secondary_logo_alt_text: "moar kitteh"
secondary_logo_image: {alt_text: "moar kitteh", bytes: 11321,…}
secondary_thumbnail_alt_text: "kitteh"
secondary_thumbnail_image: {alt_text: "kitteh", bytes: 10217,…}
state: "CT"
subtitle: "High School"
thumbnail_alt_text: "kitteh"
thumbnail_image: {alt_text: "kitteh", bytes: 10217,…}
title: "Ashwood"
use_primary_logo: true
use_primary_thumbnail: true
zip: "06254"
 * 
 */
