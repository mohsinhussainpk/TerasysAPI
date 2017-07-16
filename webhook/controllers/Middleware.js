const Account = require('../models/AccountModel');
const Message = require('../models/MessageModel');
const Presence = require('../models/PresenceModel');
const Track = require('../models/TrackModel');

module.exports = {
  extractData:  (req, res, next) => {
		data = req.body;
		req.body = {};
		req.body.trackEvent = {};
		req.body.messageEvent = {};
		req.body.presenceEvent = {};
		req.body.AccountName = data[0]['meta'].account;
		data.forEach((request, index) => {
		if(request.meta.event === 'track') {
			req.body.trackEvent = request.payload;
		}
		else if (request.meta.event === 'message'){
			req.body.messageEvent = request.payload; 
		} else if (request.meta.event === 'presence'){
			req.body.presenceEvent = request.payload;
		}
		});
		 
		
		Account.findOne({ name: req.body.AccountName })
		.then((account, err) => {
			if (err) {
        return res.status(500).send({
          message: 'Internal sever error'
        });
      };
			if (account){
				req.body.AccountId = account._id;
				next();
			} else {
				const newAccount = new Account({
					name: req.body.AccountName,
				})
				newAccount.save()
				.then((account, err) => {
					
					if (err){
            return res.status(500).send({
              message: 'Internal sever error'
            })
          };
          req.body.AccountId = account._id;
          next();
				});
			}
    });
  }
}