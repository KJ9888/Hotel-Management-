const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');


app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const mongoURI = 'mongodb://localhost:27017/wanderlust';

main().then(()=> {
    console.log("Connected to MongoDB successfully");
})
.catch(err => console.log(err));
async function main() {
    await mongoose.connect(mongoURI);
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//listings route(Index Route)
app.get('/listings', async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
});

//Create New Listing Form Route
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});
app.post('/listings', async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect(`/listings`);
});


//Show Route
app.get('/listings/:id', async (req, res) => {
    const { id } = req.params;
    const listing =  await Listing.findById(id);
    res.render('listings/show.ejs', { listing });
});

//edit route
app.get('/listings/:id/edit', async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
});
app.put('/listings/:id', async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    res.redirect(`/listings/${updatedListing._id}`);
});

//delete route
app.delete('/listings/:id', async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}); 

// app.get('/testlistings', async (req, res) => {
//     let sampleListing= new Listing({
//         title: "Sample Listing",
//         description: "This is a sample listing for testing purposes.",  
//         price: 100,
//         location: "Sample Location",
//         country: "Sample Country",
//     });
//     await sampleListing.save();
//     res.send('Sample listing created and saved to the database.');
// });

