const axios = require('axios') ;

const weather = async (req,res)=>{
    const options = {
        method: 'GET',
        url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
        params: {q: req.body.location, days: '3'},
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPIKEY,
          'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
          'Accept-Encoding':'application/json'
        }
      };
      
      try {
        const weather = await axios.request(options)
        console.log(weather?.data)
        res.json(weather?.data)
      } catch (error) {
        console.error(error.message)
        res.status(400).json({message:error.message})
        
      }


      


}



module.exports = weather;
