const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// ROUTE HANDLERS
exports.checkID = (req,res,next,val) => {
    console.log(`Running the check ID middleware for ID : ${val}`)
    if(req.params.id * 1 > tours.length) {
        return res.status(400).json({
            status: 'Failure',
            message: 'Invalid ID'
        })
    }
    next();
}

exports.checkBody = (req,res,next) => {
    if(!("name" in req.body) || !("price" in req.body)) {
        return res.status(400).json({
            status: "Failure",
            message: "Bad request"
        })
    }
    next();
}

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
    res.status(200).json({
        status: 'success',
        data : {
            tour
        }
    })
}

exports.updateTour =  (req,res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour : 'Updated tour data...'
        }
    })
}

exports.deleteTour =  (req,res) => {
    res.status(204).json({
        status: 'success',
        data: null
    })
}