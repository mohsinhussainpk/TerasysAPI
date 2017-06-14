const Account = require('../models/AccountModel');
const Presence = require('../models/PresenceModel');
const Pagination = require('../helper/helper');

module.exports = {
  savePresenceEvent:  (req, res, next) => {
		const presenceEvent = req.body.presenceEvent;
		if(Object.keys(presenceEvent).length < 1){
			next();
		} else {
			presenceEvent.account_id = req.body.AccountId;
			const newPresenceEvent = new Presence(presenceEvent);
			newPresenceEvent.save()
				.then((account, err) => {
					if (err){
            return res.status(500).send({
              message: 'Internal sever error'
            });
          }
						next();
				});
      }
   },
   retrievePresenceEvents: (req, res) => {
      const limit = parseInt(req.body.limit) || 10
      const offset = parseInt(req.body.offset) || 0
	    Account.findOne({ name: req.body.AccountName.trim().toLowerCase() })
			.then((account, err) => {
        if(!account){
          return res.status(404).send({
            message: 'Account does not exist'
          })
        }
				const account_id = account._id;
				Presence.find({ account_id })
        .sort( { createdOn: -1 } )
        .skip(offset)
        .limit(limit)
        .then((presenceEvents, err) => {
          if (err) {
            return res.status(500).send({
              message: 'Internal sever error'
            })
          };
          Presence.find({ account_id }).count()
					.then((count, err) => {
						pagination = Pagination.paginateResult(count, offset, limit)
						return res.status(200).send({
							presenceEvents,
							pagination,
						})
					})
        });
			});
   }
}