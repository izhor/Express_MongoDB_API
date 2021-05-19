const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();


//connecting to mongodb

var your_MongoDB_Atlas_url = ''; /**
 * 
for using connection to your mongoDB atlas, here some steps i can provide:
1. sign in/up into https://cloud.mongodb.com/
2. go to your cluster, if you don't have any create one(you only able to make one free cluster with 512MB storage)
3. press 'CONNECT' button below your cluster name
4. select 'Connect your application', then select 'Node.js' for driver, and '3.6 or later' for version
5. then you'll be given the link to your database, make sure to replace <password> tags with your mongoDB cluster password

for using local db:
1. use mongodb shell(mongosh) you can download it here: https://www.mongodb.com/try/download/community?tck=docs_server
you can eiter use .zip, or .msi, but i prefer .zip for comfortability
2. open cmd, then change directory to where the mongosh is installed, in my case its c:/mongodb/bin
3. then type 'mongosh', the database will automatically start
 */
var local_MongoDB_url = 'mongodb://127.0.0.1:27017/'

async function loadPostsCollection() {
    const client = await mongodb.MongoClient.connect(local_MongoDB_url,{
        useNewUrlParser: true
    });

    return client.db('node_mongodb').collection('posts');

}

//get post
router.get('/', async (req,res)=>{
    const posts = await loadPostsCollection();
    res.send(await posts.find({}).toArray());
});
//add post

router.post('/', async (req, res) =>{
    const posts = await loadPostsCollection();
    await posts.insertOne({
        text: req.body.text,
        createdAt: new Date()
    });
    res.status(201).send();
} );

//delete post

router.delete('/:id', async (req, res)=>{
    const posts = await loadPostsCollection();
    await posts.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
    res.status(200).send();
});

//Update Post
router.put('/:id', async(req,res)=>{
    const posts = await loadPostsCollection();
    var myQuery = {_id: new mongodb.ObjectID(req.params.id)};
    var newValue = {$set:{text: req.body.text}};
    await posts.updateOne(myQuery, newValue);
    console.log('update success');
    res.send(200).send();
});



module.exports = router;