exports.getOverview =  (req,res) => {
    res.status(200).render('overview', {
        title: 'All tours'
    });
}

exports.getBase = (req,res) => {
    res.status(200).render('base', {
        tour: 'The Forest Hiker',
        user: 'Shreyash'
    });
}

exports.getTour =  (req,res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker'
    });
}