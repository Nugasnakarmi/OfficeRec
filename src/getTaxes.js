import fire from './config/fire';

const db = fire.firestore();

export function getSubcollections(passedCollection) {
    console.log('GetSubCollection runs for', passedCollection);
    var fullPath = 'UserBase/' + this.props.user + '/' + passedCollection;
    db.collection(fullPath).get().then((subdoc) => {
        let itemNumber = 1;
        subdoc.forEach((sd) => {
            var itemName = passedCollection + itemNumber;
            //console.log("ItemName", itemName);
            //console.log(sd.data());
            //this.taxTypes.passedCollection = sd.data();
            this.dataObject[itemName] = sd.data();
            itemNumber++;
        });
    }).then(filterData);
}

function filterData() {
    //console.log('Data fetched from userbase', this.dataObject);
    console.log('Data fetched from userbase', this.dataObject);
    this.landData = [];
    this.vehicleData = [];
    this.incomeData = [];
    this.houseData = [];
    if (this.dataObject) {

        for (let key in this.dataObject) {
            console.log("key", key);
            if (key.includes('land-tax')) {
                this.landData.push(this.dataObject[key]);
            }
            else if (key.includes('vehicle-tax')) {
                this.vehicleData.push(this.dataObject[key]);
            }
            else if (key.includes('income-tax')) {
                this.incomeData.push(this.dataObject[key]);
            }
            else if (key.includes('house-tax')) {
                this.houseData.push(this.dataObject[key]);
            }
        }
        this.setState({ loaded: !this.state.loaded });
        //console.log('LandData', this.landData);
        //console.log('VehicleData', this.vehicleData);
        //console.log('IncomeData', this.incomeData);
        // console.table("LandData", this.landData);
    }
}
