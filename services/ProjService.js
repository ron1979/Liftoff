const mongo = require('mongodb');
var DBService = require('./DBService');

function getById(projId) {
	projId = new mongo.ObjectID(projId);
	return new Promise((resolve, reject) => {
		DBService.dbConnect().then(db => {
			db.collection('proj').findOne({ _id: projId }, (err, proj) => {
				// console.log('proj',proj)
				if (err) reject(err);
				else resolve(proj);
				db.close();
			});
		});
	});
}

function add(proj) {
	return new Promise((resolve, reject) => {
		DBService.dbConnect().then(db => {
			db.collection('proj').insertOne(proj, (err, res) => {
				db
					.collection('proj')
					.findOne(
						{ _id: new mongo.ObjectID(res.insertedId) },
						(err, projFromDB) => {
							if (err) reject(err);
							else resolve(projFromDB);
							db.close();
						}
					);
			});
		});
	});
}

function remove(projId) {
	projId = new mongo.ObjectID(projId);
	return new Promise((resolve, reject) => {
		DBService.dbConnect().then(db => {
			db.collection('proj').deleteOne({ _id: projId }, (err, res) => {
				if (err) reject(err);
				else resolve();
				db.close();
			});
		});
	});
}

function update(proj) {
	proj._id = new mongo.ObjectID(proj._id);
	return new Promise((resolve, reject) => {
		DBService.dbConnect().then(db => {
			db
				.collection('proj')
				.updateOne({ _id: proj._id }, proj, (err, updatedProj) => {
					if (err) reject(err);
					else resolve(updatedProj);
					db.close();
				});
		});
	});
}

function query(criteria) {
	var skip = +criteria.skip;
	if (!skip || skip === 0) {
		delete criteria.skip;
		skip = 0;
	}
	var limit = +criteria.limit;
	if (!limit || limit === 0) {
		delete criteria.limit;
	}

	var regex = new RegExp('.*' + criteria.searchTxt + '.*', 'i');

	var category = criteria.category ? criteria.category : new RegExp('[sS]*');
	var duration = criteria.duration ? JSON.parse(criteria.duration) : null;

	var queryFilter;

	if (duration) {
		queryFilter = {
			$and: [
				{
					$or: [
						{ title: regex },
						{ desc: regex },
						{ category: regex },
						{ duration: regex }
					]
				},
				{ category },
				{ duration }
			]
		};
	} else {
		queryFilter = {
			$and: [
				{
					$or: [
						{ title: regex },
						{ desc: regex },
						{ category: regex },
						{ duration: regex }
					]
				},
				{ category }
			]
		};
	}

	console.log('query!', queryFilter);

	return new Promise((resolve, reject) => {
		DBService.dbConnect().then(db => {
			db
				.collection('proj')
				.find(queryFilter, {
					title: 1,
					desc: 1,
					category: 1,
					fundingGoal: 1,
					fundsRaised: 1,
					duration: 1,
					featuredImgUrl: 1,
					isFavorite: 1
				})
				.skip(skip)
				.limit(limit || 12)
				.toArray((err, projs) => {
					if (err) reject(err);
					else resolve(projs);
					// console.log('projs! for',criteria,projs)
					db.close();
				});
		});
	});
}

function updateFundsRaised(proj) {
	return new Promise((resolve, reject) => {
		// let isValidate = validateDetails(user);
		// if (!isValidate) reject('Validate failed!');
		proj._id = new mongo.ObjectID(proj._id);
		DBService.dbConnect().then(db => {
			db.collection('proj').updateOne(
				{ _id: proj._id },
				{
					$inc: {
						fundsRaised: proj.diff
					}
				},
				(err, updatedInfo) => {
					if (err) reject(err);
					else {
						db
							.collection('proj')
							.findOne(
								{ _id: proj._id },
								{ fundsRaised: 1, _id: 0 },
								(err, updatedUserFromDB) => {
									// console.log('updated user!',updatedUserFromDB)
									resolve(updatedUserFromDB);
								}
							);
					}
					db.close();
				}
			);
		});
	});
}

module.exports = {
	query,
	add,
	remove,
	update,
	getById,
	updateFundsRaised
};
