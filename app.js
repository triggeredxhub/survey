const express = require('express');
const bodyParser = require('body-parser')
const {sequelize,Survey,employee,Response,Department} = require('./models');
const { Op } = require("sequelize");
const path = require('path')
const fileURLToPath = require('url');
const { name } = require('ejs');

const app = express();
app.use(express.static(path.join(__dirname)));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

// Helper function to generate date ranges
function dateRange(startDate, endDate) {
    var start = startDate.split('-');
    var end = endDate.split('-');
    var startYear = parseInt(start[0]);
    var endYear = parseInt(end[0]);
    var dates = [];

    for (var i = startYear; i <= endYear; i++) {
        var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
        var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
        for (var j = startMon; j <= endMonth; j++) {
            var month = j + 1;
            var displayMonth = month < 10 ? '0' + month : month;
            dates.push([i, displayMonth].join('-'));
        }
    }

    return dates;
}

app.post('/ejs',(req,res)=>{
    const firstNum = req.body["firstNum"];
    const secondNum = req.body["secondNum"];
    try {
        console.log(firstNum,secondNum);
        res.render(path.join(__dirname,'ejs','index.ejs'),{firstNum, secondNum})
    } catch (err) {
        res.status(500).send('<h1>Internal Server Error</h1>');
    }
})

app.get('/list',(req,res) =>{
    try {
        res.render(path.join(__dirname,'ejs','index.ejs') );
    } catch (error) {
        res.status(500).send('<h1>Internal Server Error</h1>');
    }
    
})
app.get('/home',(req,res)=>{
    try {
        res.render(path.join(__dirname,'ejs','home.ejs'));
    } catch (error) {
        res.status(500).send('<h1>Internal Server Error</h1>');
    }
})

app.get('/survey/:departmentQr', async (req, res) => {
    try {
        const departmentName = req.params.departmentQr;
        const department = await Department.findOne({
            where: { departmentQr: departmentName }
        });

        if (department) {
            console.log('Department found:', department.toJSON());
            res.sendFile(path.join(__dirname, 'public', 'survey.html'));
        } else {
            res.send('<h1>No results</h1>');
        }
    } catch (error) {
        res.status(500).send('<h1>Internal Server Error</h1>');
    }
});


app.get('/api/:departmentQr', async (req, res) => {
    try {
        const departmentName = req.params.departmentQr;
        const department = await Department.findOne({
            where: { departmentQr: departmentName }
        });

        if (department) {
            res.json(department.toJSON());
        } else {
            res.status(404).json({ error: 'Department not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// app.get('/survey/:departmentQr', async(req,res)=>{
//     try {
//         const departmentName = req.params.departmentQr;
//         const department = await Department.findOne({
//             where:{departmentQr:departmentName}
//         })
//         if (department) {
//             console.log(department)
//            return res.json(department);
           
//         }
        
//         else{
//             res.send(`<h1> no resutls</h1>`)
//         }
//     } catch (error) {
//         res.status(500).json(error);
//     }})

//CRUD for Creation of surveys
app.post('/addsurvey', async(req,res)=>{
    const {surveyName,surveyDescription} = req.body;

    try {
        const newSurvey = await Survey.create({surveyTitle:surveyName,surveyQuestion:surveyDescription});
        console.log(newSurvey);
        return res.json(newSurvey);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})



app.get('/surveys', async (req, res) => {
    
    try {
        const surveys = await Survey.findAll();
        
        return res.json(surveys);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});
app.post('/responses', async (req, res) => {
    try {
        const { startYear, startMonth, endMonth, endYear } = req.body;

        if (!startYear || !startMonth || !endYear || !endMonth) {
            return res.status(400).json({ error: 'Year and month parameters are required' });
        }
        if (startMonth > endMonth && startYear >= endYear) {
            return res.status(400).json({ error: "Start month must be less than end month when years are the same" });
        }

        const startDate = `${startYear}-${startMonth}-01`;
        const endDate = `${endYear}-${endMonth}-31`;

        const dates = dateRange(startDate, endDate);
        let results = [];

        for (let date of dates) {
            let [year, month] = date.split('-');
            let startOfMonth = new Date(year, month - 1, 1);
            let endOfMonth = new Date(year, month, 0);

            let count = await Response.count({
                where: {
                    createdAt: {
                        [Op.between]: [startOfMonth, endOfMonth]
                    }
                }
            });

            results.push({ date, count });
        }

        return res.json({ results });

    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});






app.post('/responses/details', async (req, res) => {
    try {
        const { startYear, startMonth, endMonth, endYear } = req.body;

        if (!startYear || !startMonth || !endYear || !endMonth) {
            return res.status(400).json({ error: 'Year and month parameters are required' });
        }
        if (startMonth > endMonth && startYear >= endYear) {
            return res.status(400).json({ error: "Start month must be less than end month when years are the same" });
        }

        const startDate = new Date(`${startYear}-${startMonth}-01T00:00:00Z`);
        const endDate = new Date(`${endYear}-${endMonth}-31T23:59:59Z`);

        const responses = await Response.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        if (responses.length === 0) {
            return res.status(404).json({ message: 'No responses found within the given date range' });
        }

        return res.json(responses);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});



app.post('/updatesurveys',async(req,res)=>{
    const{surveyName,surveyDescription,surveyNo} = req.body

    try {
        const survey = await Survey.update({
            surveyTitle:surveyName,
            surveyQuestion:surveyDescription
        },{
            where:{
                surveyId:surveyNo
            }
        });
        return res.status(200).json(req.body);
    } catch (err) {
        
    }
})

app.post('/deletesurvey',async(req,res)=>{
    const {surveyNo} = req.body
    try {
        const result = await Survey.destroy({
            where: {
                surveyId: surveyNo
            }
        });

        if (result) {
            return res.json({ message: `Deleted survey number ${surveyNo}` });
        } else {
            return res.status(404).json({ message: 'Survey not found' });
        }
    
    } catch (err) {
        
    }
})
// end of crud for creation of surveys


//crud for survey response

app.post('/submitRating', async (req, res) => {
    const responses = req.body; // Expecting an array of responses
    try {
        const result = await Promise.all(
            responses.map(response => 
                Response.create({
                    surveyNo: response.surveyNum,
                    rating: response.rateUser,
                    Department: response.departmentNo,
                    employeeNo: response.employee
                })
            )
        );
        return res.json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});


// end of crud for survey response
//Add department
app.post('/addDepartment', async(req,res)=>{
    const { name, qr} = req.body
    try {
        const result = await Department.create({departmentName:name,DepartmentQr:qr})
        return res.json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    
    }
})
// end department
// add Employee
app.post('/addEmployee', async(req,res)=>{
    const { fname, lname, departmentNo, position} = req.body
    try {
        const result = await employee.create({firstname:fname,Lastname:lname,Department:departmentNo,Designation:position})
        return res.json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    
    }
})
// end employee



app.listen({port:5000},async()=>{
    await sequelize.sync({alter:true})
    console.log("databaseSynced");
})