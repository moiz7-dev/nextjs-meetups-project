import { Fragment } from "react";
import Head from 'next/head';
import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta name="description" content="List of react meetups" />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://reactUser:qjdFSb3VJojfxuMF@cluster0.3cben.mongodb.net/react-meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  console.log(meetups);

  client.close();

  return {
    props: {
      meetups: meetups.map((m) => {
        return {
          title: m.title,
          image: m.image,
          address: m.address,
          id: m._id.toString(),
        };
      }),
    },
    revalidate: 10,
  };
}

export default HomePage;
