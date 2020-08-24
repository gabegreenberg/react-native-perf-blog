# React-native-perf

## Overview of Hermes

- What is Hermes
  - An engine optimized for running RN on Android devices
  - How to use Hermes: [Using hermes](https://reactnative.dev/docs/hermes)
- How is it better than other engines? Possible comparisons with V8 and JSC.
  - Summarize this [article](http://blog.nparashuram.com/2019/07/facebook-announced-hermes-new.html) where an experiment was run to compare Hermes vs JS engine, and record of the runtime performance
- Introduce the transformer
  - A mechanism that converts information from Hermes profile to be processed by Chrome
  - Developers can now evaluate the app's performance on Chrome DevTools

## Hermes Profile Transformer

### Understanding trace events

Trace events are data points that determine the state of an app at any point of time. They can contain information about the functions running at particular durations in the application. The Hermes profiles are of the JSON format, which has two variations, namely -

1. JSON Array format - JSON Array format is the simplest format, it simply has an array of event objects which indicate the start and end times (based on phases) and can be loaded into Chrome DevTools to visualise the performance of an application.
2. JSON Object format - JSON Object format allows for more data to be captured in the events, by taking a variety of properties as inputs.

The event categories, phases, timestamp and args are critical arguments that add a lot of information to the events making profiling easy.
Stack traces can be associated with events by means of "sf" parameter or an array of stack traces.

The _phases_ of events are the most important properties for tracing events as they indicate the state of the events in the call stack. In the case of Hermes profile, we assume that all events are duration events.

### Duration Events

- Begin and End Phases
- Does not work with improperly nested functions (usually introduced by asynchronous execution of code). These cases can be handled by Async Events

## Usage and interpretation (regular JS files)

- The events can be categoried into broad categories based on the context of their origin. Events usually written in source code fall under the category of 'Javscript', while the events exected natively on the platform are appropriately categoried as 'Native'

### Definition

![DemoImage](assets/images/startnodes-endnodes.png)

1. **Nodes** - Nodes stand for all the events possible in a function call stack. For eg:

   ```ts
   "2" : {
   "line": "8",
   "column": "12",
   "funcLine": "8",
   "funcColumn": "12",
   "name": "f1(test.js:8:12)",
   "category": "JavaScript",
   "parent": 1
   }
   ```

   Each of these stack frame objects can have corresponding begin and end events. The individual begin/end events can be referred to as nodes.

   Nodes only have context in particular timestamps, i.e. a node can be in `start`, `end` or `running` state at a particular timestamp

2. **Active and Last Active Nodes** - Building upon the previous definition, the active nodes at any particular time are the nodes that are active in the current timestamp. The Last active nodes similiarly stand for the nodes that were active in the preceding sampling time.
3. **Start and End Nodes** - We can define start nodes as **nodes active in current timestamp but absent in last active nodes**, while the end nodes can be defined as **nodes in last active nodes but absent in current active nodes**

The Hermes Profile transformer works by identifying start and end nodes at each timestamp and creating events from these nodes to be displayed on Chrome DevTools.

## Usage: Integrated into RN CLI

- Command:
  - Only works for DEV mode, since CLI interacts with adb to pull the profile from Android device
  - `npx react-native profile-hermes`, allows users to pull the converted device to their local machine
- Three categories - what each category represents and which parts of the code base should we be focusing on
  - Categories: Native, JS, node_modules
  - Which part to focus on: JS code (functions that are part of the program)
- Timestamp and duration of events
  - How to look at timestamp and duration of events, so that evaluate which function of the app takes the most time

### interpretation of the profile

The duration of a function call can be identified by from the timestamps of the corresponding start and end events. If this information is successfully captured, the events show up in horizontal bars.
![Profile](assets/images/profile.png)

As you may observe the functions can be seen in horizontal lines, and the time axis can help us determine how long a function runs.
The function calls can also be selected for extra details, for eg:
![EventInfo](assets/images/SummaryOfEvent.jpeg)
These summaries explicitly contain how long the function runs and we can also identify the line and column numbers by means of which we can also isolate parts of our code base that slows us down.

Sourcemaps add a lot of value here, as by default the line and column numbers are those indicated in bundle files, however upon using source maps we can map our function calls to regular "unbundled" files, improving debugging experience.

The categories of events help us determine the color of the function rows in the visualisation. We broadly have 2 types of categories namely,

1. Obtained from **source maps** - Sourcemaps can be optionally provided to augment the information provided by hermes. The sourcemaps help us identify better categories for events, hence adding value to our visualisation. These categories include two broad categories, namely:
   - `react-native-internals`
   - `node_modules`
2. Obtained from Hermes Samples - These categories are obtained by default and can be mapped to function calls. Categories `Javascript` and `Native` are predominantly seen, and in tandem with Source maps, this can help us differentiate from the boiler plate code written in node_modules and the actual code that we write.
