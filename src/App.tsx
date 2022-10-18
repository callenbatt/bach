import { Component, createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";
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
  ListItem,
  UnorderedList,
  CircularProgress,
  CircularProgressIndicator,
  Box,
  Center,
  HStack,
  Flex,
  Spacer,
  Text,
} from "@hope-ui/solid";

import Papa from "papaparse";

// import logo from './logo.svg';
import styles from "./App.module.css";
import { preview } from "vite";

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
  "Category",
  "Primary Thumbnail",
  "Primary Thumbnail Alt-Text",
  "Primary Logo",
  "Primary Logo Alt-Text",
  "Secondary Thumbnail",
  "Secondary Thumbnail Alt-Text",
  "Secondary Logo",
  "Secondary Logo Alt-Text",
];

type PhoneNumber = {
  number: string;
};

type Location = {
  name: string;
  address1?: string;
  address2?: string;
  city?: string;
  country?: string;
  email?: string;
  fax?: PhoneNumber;
  motto?: string;
  phone?: PhoneNumber;
  state?: string;
  subtitle?: string;
  title?: string;
  zip?: string;
  [key: string]: any;
};

type Task = {
  location: Subtask;
  locationPrimaryLogo?: Subtask;
  locationPrimaryThumbnail?: Subtask;
  locationSecondaryLogo?: Subtask;
  locationSecondaryThumbnail?: Subtask;
  [key: string]: any;
};

type Subtask = {
  title: string;
  body: {
    [key: string]: any;
  };
  display: {}[];
};

type DisplayListItem = {
  key: string;
  value: string;
};

const App: Component = () => {
  const [getData, setData] = createStore([] as Task[]);

  const handleInputFile = async (e: Event) => {
    const file = ((e.target as HTMLInputElement).files as FileList)[0] as File;

    //return if not a csv
    if (file.type !== "text/csv") return;

    // get the text
    const csvText = await file.text();

    // get the data
    const data = Papa.parse(csvText, { header: true }).data;
    // return if there is no data
    if (!Array.isArray(data)) {
      return console.error("invalid csv");
    }

    // get the headers
    const headers = Object.keys(data[0]);

    // check/warn for missing headers
    const headersNotFoundInImport = expectedHeaders.filter(
      (h) => !headers.includes(h)
    );
    console.log(headersNotFoundInImport);

    // build the tasks
    const tasks = data.map((location): Task => {
      const locationName = location["Location Name"];
      // for each task, the first task is to import the location
      function subtaskLocation(location: any): Subtask {
        const body: Location = {
          name: locationName,
        };
        const display = [{ key: "Location Name", value: locationName }];

        const mapping: {} = {
          "Address 1": "address1",
          "Address 2": "address2",
          "City/Town": "city",
          Country: "country",
          Email: "email",
          "Fax Number": "fax",
          Motto: "motto",
          "Phone Number": "phone",
          "State/Province": "state",
          Subtitle: "subtitle",
          Title: "title",
          "Postal Code": "zip",
        };

        Object.keys(mapping).forEach((header) => {
          const value = location[header];

          if (!value || !mapping[header as keyof typeof mapping]) {
            return;
          }

          body[mapping[header as keyof typeof mapping]] = value;

          display.push({ key: header, value: value });
        });

        return { title: "Location Setup", body, display };
      }

      function subtaskLocationImage(location: any, image: string): Subtask {
        const url = location[image];
        const altText = location[`${image} Alt-Text`];

        return {
          title: `Location ${image}`,
          body: {
            url: url,
            name: locationName,
          },
          display: [
            { key: image, value: url },
            { key: `${image} Alt-Text`, value: altText },
          ],
        };
      }

      const task: Task = { location: subtaskLocation(location) };

      [
        "Primary Logo",
        "Primary Thumbnail",
        "Secondary Logo",
        "Secondary Thumbnail",
      ].forEach((image: string) => {
        if (location[image]) {
          task[`location${image.replace(/\s/, "")}`] = subtaskLocationImage(
            location,
            image
          );
        }
      });

      return task;
    });

    setData(tasks);
  };

  const handleSetupSwitch = (e: Event) => {
    const label = (e.currentTarget as HTMLInputElement).getAttribute(
      "data-label"
    );
    const key = `setup${label}`;
    const data = getData;
    if (data[key as keyof typeof data]) {
      console.log(data);
      console.log("delete it!");
      delete data[key as keyof typeof data];
      setData(data);
    } else {
      console.log(data);
      console.log("add it!");
      const newData = data.map((task: Task) => {
        return {
          ...task,
          [key]: {
            title: `Setup ${label}`,
            body: {},
            display: [],
          },
        };
      });
      setData(newData);
    }
  };

  return (
    <VStack width={"100%"}>
      <Flex>
        <Box>
          <Input
            paddingTop="$1"
            type="file"
            size="md"
            oninput={(e: Event) => handleInputFile(e)}
          />
        </Box>
        <Spacer />
        <Box>
          <Alert status="info">
            <AlertIcon mr="$2_5" />
            <VStack>
              <p>
                <a href="#">Click here</a> for an example data sheet
              </p>
              <p>File must be .csv whith proper headers</p>
            </VStack>
          </Alert>
        </Box>
      </Flex>
      <HStack spacing={"$16"}>
        <Heading>Setup Options:</Heading>
        <Switch
          data-label="Posts"
          labelPlacement={"end"}
          onClick={handleSetupSwitch}
        >
          Posts
        </Switch>
        <Switch
          data-label="Resources"
          labelPlacement={"end"}
          onClick={handleSetupSwitch}
        >
          Resources
        </Switch>
        <Switch
          data-label="Messages"
          labelPlacement={"end"}
          onClick={handleSetupSwitch}
        >
          Messages
        </Switch>
        <Switch
          data-label="Forms"
          labelPlacement={"end"}
          onClick={handleSetupSwitch}
        >
          Forms
        </Switch>
      </HStack>

      <Heading>Import</Heading>
      <Accordion allowMultiple width={"100%"}>
        <For each={getData}>
          {(task: Task, i) => {
            return (
              <AccordionItem data-index={i}>
                <h2>
                  <AccordionButton>
                    <CircularProgress size="$4" value={0}>
                      <CircularProgressIndicator color="$success9" />
                    </CircularProgress>
                    <span>{task.location.body.name}</span>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <Accordion allowMultiple>
                    <For each={Object.keys(task)}>
                      {(subtask: any, j) => {
                        return (
                          <AccordionItem data-index={j}>
                            <h3>
                              <AccordionButton>
                                <CircularProgress size="$4" value={0}>
                                  <CircularProgressIndicator color="$success9" />
                                </CircularProgress>
                                <span>{task[subtask].title}</span>
                                <AccordionIcon />
                              </AccordionButton>
                            </h3>
                            <AccordionPanel>
                              <UnorderedList>
                                <For each={task[subtask].display}>
                                  {(displayListItem: DisplayListItem, k) => {
                                    return (
                                      <ListItem data-index={k}>
                                        {displayListItem.key}:{" "}
                                        {displayListItem.value}
                                      </ListItem>
                                    );
                                  }}
                                </For>
                              </UnorderedList>
                            </AccordionPanel>
                          </AccordionItem>
                        );
                      }}
                    </For>
                  </Accordion>
                </AccordionPanel>
              </AccordionItem>
            );
          }}
        </For>
      </Accordion>
      <Button>Import</Button>
    </VStack>
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
