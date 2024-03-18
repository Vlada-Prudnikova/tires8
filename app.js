const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Serve the index.html file statically
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.json()); // Parse JSON bodies

let tireInventory = [
    { brand: 'Brand A', quantity: 10, size: '195/65R15' },
    { brand: 'Brand B', quantity: 8, size: '205/55R16' }
];

app.use((req, res, next) => {
    console.log(`Request received for path: ${req.path}`);
    next();
});

app.post('/api/save-tire-inventory', (req, res) => {
    const newData = req.body;
    console.log('Received new tire inventory data:', newData);

    // Check if newData is an empty object
    if (Object.keys(newData).length === 0 && newData.constructor === Object) {
        console.error('Received empty tire inventory data');
        return res.status(400).send('Received empty tire inventory data');
    }

    const newTire = {
        brand: newData.brand,
        quantity: newData.quantity,
        size: `${newData.width}/${newData.aspectRatio}R${newData.rimDiameter}`
    };

    console.log('Before:', tireInventory);
    tireInventory.push(newTire); // Push new tire object, not newData
    console.log('After:', tireInventory);

    // Save updated tireInventory array to JSON file
    fs.writeFile('tireInventory.json', JSON.stringify(tireInventory), (err) => {
        if (err) {
            console.error('Error writing tire inventory data:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Tire inventory data saved successfully.');
            res.status(200).send('Tire inventory data saved successfully.');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

