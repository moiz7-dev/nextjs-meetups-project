import {Fragment} from 'react';
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

import classes from "./index.module.css";

const MeetupDetailPage = (props) => {
  const { meetupData } = props;

  return (
    <Fragment>
      <Head>
        <title>{meetupData.title}</title>
        <meta name="description" content={meetupData.description} />
      </Head>
      <section className={classes.detail}>
        <img src={meetupData.image} alt={meetupData.title} />
        <h1>{meetupData.title}</h1>
        <address>{meetupData.address}</address>
        <p>{meetupData.description}</p>
      </section>
    </Fragment>
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://reactUser:qjdFSb3VJojfxuMF@cluster0.3cben.mongodb.net/react-meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetupIds = await meetupsCollection.find({}, { _id: 1 }).toArray();

  return {
    fallback: 'blocking',
    paths: meetupIds.map((m) => ({ params: { meetupId: m._id.toString() } })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://reactUser:qjdFSb3VJojfxuMF@cluster0.3cben.mongodb.net/react-meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetupData = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  console.log(meetupData);

  return {
    props: {
      meetupData: {
        image: meetupData.image,
        id: meetupData._id.toString(),
        title: meetupData.title,
        address: meetupData.address,
        description: meetupData.description,
      },
    },
  };
}

export default MeetupDetailPage;
