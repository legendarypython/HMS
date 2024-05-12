

exports.getUniqueIdForMongo = async (model, field, next) => {
        try {
            const maxId = await model.findOne().sort({_id: -1}).exec();
            const id = maxId ? maxId[field] + 1 : 1;
         
            return id;
        } catch (error) {
           next(error);
        }
      };
