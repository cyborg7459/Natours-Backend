const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());
app.use((req,res,next) => {
    console.log('Hello from the middleware !!!');
    next();
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const getAllTours =  (req,res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
}

const addTour =  (req,res) => {
    const newId = tours[tours.length-1].id + 1;
    const newTour = {...req.body, id: newId};
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data : {
                tour: newTour
            }
        })
    })
}

const getSingleTour = (req,res) => {
    const tour = tours.find(el => el.id == req.params.id);
    if(tour) {
        res.status(200).json({
            status: 'success',
            data : {
                tour
            }
        })
    }
    else {
        res.status(404).json({
            status: 'failure',
            message: 'Not Found'
        })
    }
}

const updateTour =  (req,res) => {
    const id = req.params.id;
    if(id>tours.length) {
        res.status(404).json({
            status: 'failure',
            message: 'Invalid ID'
        })
    }
    else {
        res.status(200).json({
            status: 'success',
            data: {
                tour : 'Updated tour data...'
            }
        })
    }
}

const deleteTour =  (req,res) => {
    const id = req.params.id;
    if(id>tours.length) {
        res.status(404).json({
            status: 'failure',
            message: 'Invalid ID'
        })
    }
    else {
        res.status(204).json({
            status: 'success',
            data: null
        })
    }
}

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', addTour);
// app.get('/api/v1/tours/:id', getSingleTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(addTour);

app.route('/api/v1/tours/:id')
    .get(getSingleTour)
    .patch(updateTour)
    .delete(deleteTour);

app.listen(3000, () => {
    console.log('Server running on port 3000');
})