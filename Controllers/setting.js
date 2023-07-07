import Setting from '../Models/Settings.js';


const read = async (req, res) => {
    try{
        const setting = await Setting.findOne().sort({ _id : -1 })
        if(setting.length == 0){
            try {
                let stg = await Setting({})
                stg = await stg.save();
                let stg2 = await Setting({})
                stg2 = await stg2.save();
                res.json(stg2)
            }catch(err){
                res.status(500).json({error: err.message})
            }
        }
        
        res.status(200).json(setting)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}


const create = async (req, res) => {
    try {
        let setting = {
            ...req.body
        }
        let stg = await Setting.findOneAndUpdate({}, {$set: setting }, { new: true, sort: { _id: -1 }})
        stg = await stg.save();
        await read(req, res)
    }catch(err){
        console.log(err)
        res.status(500).json({error: err.message})
    }
}

export { read, create }