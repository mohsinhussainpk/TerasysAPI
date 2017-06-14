const Track = require('../models/TrackModel');
const Account = require('../models/AccountModel');
const Pagination = require('../helper/helper');

module.exports = {
  saveTrackEvent:  (req, res, next) => {
		const trackEvent = req.body.trackEvent;
		if(Object.keys(trackEvent).length < 1){
			next();
		} else {
			trackEvent.account_id = req.body.AccountId;
			const newTrackEvent = new Track(trackEvent);
			newTrackEvent.save()
			  .then((account, err) => {
					if (err){
						return res.status(500).send({
            	message: 'Internal sever error'
          	});
					};
					return res.status(200).send('OK');
				});
      }
   },
   retrieveTrackEvents: (req, res) => {
		 const limit = parseInt(req.body.limit) || 10
     const offset = parseInt(req.body.offset) || 0
	   Account.findOne({ name: req.body.AccountName.trim().toLowerCase() })
		 .then((account, err) => {
       if (err) {
				 return res.status(500).send({
            message: 'Internal sever error'
          })
			 }
			 if(!account){
          return res.status(404).send({
            message: 'Account does not exist'
          })
       }
       const account_id = account._id;
       Track.find({ account_id })
      .sort( { createdOn: -1 } )
      .skip(offset)
      .limit(limit)
      .then((trackEvents, err) => { 
        if (err) {
          return res.status(500).send({
            message: 'Internal sever error'
          })
			}
			Track.find({ account_id }).count()
			.then((count, err) => {
				pagination = Pagination.paginateResult(count, offset, limit)
				return res.status(200).send({
					trackEvents,
					pagination,
				})
			})
		});
   });
  }
}