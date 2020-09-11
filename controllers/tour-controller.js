const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// ROUTE HANDLERS

exports.getAllTours =  (req,res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
}

exports.addTour =  (req,res) => {
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

exports.getSingleTour = (req,res) => {
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

exports.updateTour =  (req,res) => {
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

exports.deleteTour =  (req,res) => {
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