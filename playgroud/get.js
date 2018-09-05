const express = require('express');
const app = express();

//  Query String
// /api/quertString/1/?test=134
app.get('/api/quertString/:id', (req,res) => {
    let result = {
        params: req.params, // 1
        query_parameter: req.query // ?test=134
    }
});