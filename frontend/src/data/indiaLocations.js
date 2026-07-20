/**
 * Comprehensive India Locations Data
 * All 28 States + 8 Union Territories, major districts, and key areas/localities
 * Format: { id, name, level: 'STATE'|'DISTRICT'|'AREA', parentId }
 */

let _id = 1;
const mkId = () => _id++;

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // Union Territories
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
  'Andaman & Nicobar Islands', 'Dadra & Nagar Haveli', 'Lakshadweep'
];

// State ID map
const stateIds = {};
const stateNodes = states.map(name => {
  const id = mkId();
  stateIds[name] = id;
  return { id, parentId: null, name, level: 'STATE' };
});

// Districts grouped by state
const districtData = {
  'Andhra Pradesh': [
    { name: 'Visakhapatnam', areas: ['Rushikonda', 'Gajuwaka', 'MVP Colony', 'Dwaraka Nagar', 'Steel Plant Area'] },
    { name: 'Vijayawada', areas: ['Benz Circle', 'Governorpet', 'Labbipet', 'Patamata'] },
    { name: 'Guntur', areas: ['Brodipet', 'Amaravathi Road', 'Lakshmipuram'] },
    { name: 'Tirupati', areas: ['Alipiri', 'Renigunta', 'Tiruchanoor'] },
    { name: 'Nellore', areas: ['Vedayapalem', 'Pinakini Nagar', 'Grand Trunk Road'] },
    { name: 'Kurnool', areas: ['Bellary Road', 'Vaddageri', 'Nandyal Road'] },
    { name: 'Kadapa', areas: ['Ganagapeta', 'Yerramukkapalli', 'Nethaji Nagar'] },
    { name: 'Anantapur', areas: ['Gooty Road', 'Old Town', 'Subash Nagar'] },
    { name: 'Chittoor', areas: ['Madanapalle', 'Kuppam', 'Punganur'] },
    { name: 'Krishna', areas: ['Machilipatnam', 'Gudivada', 'Nuzvid'] }
  ],
  'Arunachal Pradesh': [
    { name: 'Itanagar', areas: ['Naharlagun', 'Nirjuli', 'Banderdewa'] },
    { name: 'Tawang', areas: ['Tawang Town', 'Lumla'] },
    { name: 'East Siang', areas: ['Pasighat', 'Namsai'] },
    { name: 'Papum Pare', areas: ['Yupia', 'Balijan'] },
    { name: 'West Kameng', areas: ['Bomdila', 'Dirang', 'Kalaktang'] }
  ],
  'Assam': [
    { name: 'Guwahati', areas: ['Paltan Bazar', 'Fancy Bazar', 'Pan Bazar', 'Dispur', 'Ganeshguri', 'Lakhtokia', 'Jalukbari', 'Azara'] },
    { name: 'Dibrugarh', areas: ['AT Road', 'Chowkidinghee', 'Lahoal', 'Graham Bazar'] },
    { name: 'Silchar', areas: ['Ambikapatty', 'Link Road', 'Rangirkhari'] },
    { name: 'Jorhat', areas: ['Tarajan Road', 'AT Road Jorhat', 'Cinnamara'] },
    { name: 'Tezpur', areas: ['Dekargaon', 'Bhomoraguri', 'Napaam'] },
    { name: 'Nagaon', areas: ['Haibargaon', 'Raha', 'Doboka'] },
    { name: 'Bongaigaon', areas: ['Bangaigaon Town', 'Abhayapuri'] },
    { name: 'Kamrup Rural', areas: ['Palasbari', 'Hajo', 'Sualkuchi'] }
  ],
  'Bihar': [
    { name: 'Patna', areas: ['Boring Road', 'Kankarbagh', 'Rajendra Nagar', 'Fraser Road', 'Danapur', 'Phulwari Sharif', 'Bankipur', 'Anisabad'] },
    { name: 'Muzaffarpur', areas: ['Mithanpura', 'Juran Chapra', 'Ahiyapur'] },
    { name: 'Gaya', areas: ['Bodhgaya', 'Rampur', 'Tekari'] },
    { name: 'Bhagalpur', areas: ['Khalifabag', 'Adampur', 'Tatarpur'] },
    { name: 'Darbhanga', areas: ['Laheria Sarai', 'Donar', 'Singhwara'] },
    { name: 'Arrah', areas: ['Jagdishpur', 'Dumraon', 'Buxar'] },
    { name: 'Begusarai', areas: ['Teghra', 'Bachhwara', 'Birpur'] },
    { name: 'Purnia', areas: ['Rupauli', 'Kasba', 'Banmankhi'] }
  ],
  'Chhattisgarh': [
    { name: 'Raipur', areas: ['Shankar Nagar', 'Tatibandh', 'Pachpedi Naka', 'Pandari', 'Avanti Vihar'] },
    { name: 'Bhilai', areas: ['Nehru Nagar', 'Supela', 'Durg Sector'] },
    { name: 'Bilaspur', areas: ['Gol Bazar', 'Sadar Bazar', 'Vyapar Vihar'] },
    { name: 'Korba', areas: ['Urga', 'Chhuri', 'Kathghora'] },
    { name: 'Rajnandgaon', areas: ['Kalmna', 'Bhanupratappur'] },
    { name: 'Jagdalpur', areas: ['Jagdalpur City', 'Tokapal'] }
  ],
  'Goa': [
    { name: 'North Goa', areas: ['Panaji', 'Mapusa', 'Candolim', 'Calangute', 'Anjuna', 'Vagator', 'Baga', 'Morjim', 'Pernem'] },
    { name: 'South Goa', areas: ['Margao', 'Vasco da Gama', 'Colva', 'Benaulim', 'Palolem', 'Canacona', 'Fatorda'] }
  ],
  'Gujarat': [
    { name: 'Ahmedabad', areas: ['Navrangpura', 'Satellite', 'Maninagar', 'Vastrapur', 'Bodakdev', 'Prahladnagar', 'Thaltej', 'CG Road', 'SG Highway', 'Bopal'] },
    { name: 'Surat', areas: ['Adajan', 'Vesu', 'Athwa', 'City Light', 'Pal', 'Udhna', 'Katargam'] },
    { name: 'Vadodara', areas: ['Alkapuri', 'Productivity Road', 'Fatehgunj', 'Gorwa', 'Manjalpur'] },
    { name: 'Rajkot', areas: ['Kalavad Road', 'Kothariya', 'Raiya Road', 'Gondal Road'] },
    { name: 'Bhavnagar', areas: ['Waghawadi', 'Ghogha Road', 'Shankar Tekri'] },
    { name: 'Jamnagar', areas: ['Bedi Gate', 'Digvijay Plot', 'Shantinagar'] },
    { name: 'Gandhinagar', areas: ['Sector 21', 'Sector 14', 'Kudasan', 'Infocity'] },
    { name: 'Anand', areas: ['Karamsad', 'Vallabh Vidyanagar', 'Anand Town'] }
  ],
  'Haryana': [
    { name: 'Gurugram', areas: ['DLF City', 'Sector 29', 'Cyber City', 'Sohna Road', 'Golf Course Road', 'Manesar', 'Huda City Centre', 'Sector 56'] },
    { name: 'Faridabad', areas: ['NIT', 'Sector 15', 'Ballabhgarh', 'Old Faridabad'] },
    { name: 'Ambala', areas: ['Ambala Cantt', 'Ambala City', 'Mullana'] },
    { name: 'Panipat', areas: ['Model Town', 'Sector 13', 'Shivaji Colony'] },
    { name: 'Rohtak', areas: ['Model Town', 'Sunaria Road', 'Railway Road'] },
    { name: 'Hisar', areas: ['Urban Estate', 'Hansi', 'Red Square Market'] },
    { name: 'Karnal', areas: ['Sector 7', 'Model Town', 'Kunjpura Road'] },
    { name: 'Panchkula', areas: ['Sector 8', 'Sector 11', 'MDC Sector 5', 'Kalka'] }
  ],
  'Himachal Pradesh': [
    { name: 'Shimla', areas: ['Mall Road', 'Sanjauli', 'Chakkar', 'New Shimla', 'Kasumpti'] },
    { name: 'Dharamsala', areas: ['McLeod Ganj', 'Bhagsu', 'Naddi', 'Palampur'] },
    { name: 'Manali', areas: ['Mall Road Manali', 'Old Manali', 'Solang Valley'] },
    { name: 'Kullu', areas: ['Kullu Town', 'Bhuntar', 'Dhalpur'] },
    { name: 'Solan', areas: ['Solan Town', 'Baddi', 'Parwanoo'] },
    { name: 'Mandi', areas: ['Mandi Town', 'Sundernagar', 'Jogindernagar'] },
    { name: 'Hamirpur', areas: ['Hamirpur Town', 'Sujanpur', 'Nadaun'] }
  ],
  'Jharkhand': [
    { name: 'Ranchi', areas: ['Lalpur', 'Harmu', 'Kanke Road', 'Ratu Road', 'Ashok Nagar', 'Doranda'] },
    { name: 'Jamshedpur', areas: ['Bistupur', 'Sakchi', 'Telco Colony', 'Adityapur'] },
    { name: 'Dhanbad', areas: ['Jharia', 'Hirapur', 'Sindri'] },
    { name: 'Bokaro', areas: ['Bokaro Steel City', 'Sector 4', 'Chas'] },
    { name: 'Deoghar', areas: ['Deoghar Town', 'Mohanpur', 'Karon'] }
  ],
  'Karnataka': [
    { name: 'Bengaluru Urban', areas: ['Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield', 'Jayanagar', 'JP Nagar', 'Malleswaram', 'Yelahanka', 'Electronic City', 'Marathahalli', 'Bannerghatta Road', 'BTM Layout', 'Rajajinagar', 'MG Road', 'Hebbal'] },
    { name: 'Mysuru', areas: ['Chamundipuram', 'Vijayanagar Mysuru', 'Kuvempunagar', 'Hebbal Mysuru', 'Lashkar Mohalla'] },
    { name: 'Mangaluru', areas: ['Hampankatta', 'Kadri', 'Attavar', 'Bejai', 'Balmatta'] },
    { name: 'Hubballi-Dharwad', areas: ['Gokul Road', 'Vidyanagar', 'Keshwapur', 'Deshpande Nagar'] },
    { name: 'Belagavi', areas: ['Camp Area', 'Tilakwadi', 'Bogarves', 'Rani Channamma Nagar'] },
    { name: 'Shivamogga', areas: ['Shivamogga Town', 'Shimoga Dist', 'Bhadravathi'] },
    { name: 'Tumakuru', areas: ['Tumkur Town', 'Tiptur', 'Gubbi'] },
    { name: 'Kalaburagi', areas: ['Gulbarga Station', 'Aland Road', 'Super Market'] },
    { name: 'Ballari', areas: ['Bellary Town', 'Hosapete', 'Siruguppa'] },
    { name: 'Raichur', areas: ['Raichur Town', 'Sindhanur', 'Manvi'] }
  ],
  'Kerala': [
    { name: 'Thiruvananthapuram', areas: ['Palayam', 'Kowdiar', 'Vellayambalam', 'Pattom', 'Kesavadasapuram', 'Kazhakootam', 'Technopark', 'Vazhuthacaud'] },
    { name: 'Kochi', areas: ['Ernakulam', 'Fort Kochi', 'Kakkanad', 'Aluva', 'Edapally', 'Kaloor', 'Vyttila', 'Kadavanthra'] },
    { name: 'Kozhikode', areas: ['Calicut Town', 'Mavoor Road', 'SM Street', 'Medical College', 'Nadakkavu'] },
    { name: 'Thrissur', areas: ['Round South', 'Shoranur Road', 'Punkunnam', 'Ollur'] },
    { name: 'Kollam', areas: ['Chinnakada', 'Asramam', 'Kottapuram'] },
    { name: 'Malappuram', areas: ['Manjeri', 'Tirur', 'Perinthalmanna'] },
    { name: 'Kannur', areas: ['Kannur Town', 'Thaliparamba', 'Payyannur'] },
    { name: 'Palakkad', areas: ['Palakkad Town', 'Ottapalam', 'Shoranur'] },
    { name: 'Kottayam', areas: ['Kottayam Town', 'Changanacherry', 'Pala'] },
    { name: 'Alappuzha', areas: ['Alappuzha Town', 'Cherthala', 'Haripad'] }
  ],
  'Madhya Pradesh': [
    { name: 'Indore', areas: ['Vijay Nagar', 'Geeta Bhavan', 'Palasia', 'South Tukoganj', 'New Palasia', 'Tilak Nagar', 'AB Road', 'LIG Colony', 'MG Road Indore'] },
    { name: 'Bhopal', areas: ['MP Nagar', 'Arera Colony', 'Koh-e-Fiza', 'New Market', 'Bittan Market', 'Govindpura', 'Habibganj'] },
    { name: 'Gwalior', areas: ['Lashkar', 'City Centre Gwalior', 'Hazira', 'Kampoo'] },
    { name: 'Jabalpur', areas: ['Napier Town', 'Wright Town', 'Civil Lines Jabalpur'] },
    { name: 'Ujjain', areas: ['Freeganj', 'Mahakal Area', 'Dewas Road'] },
    { name: 'Sagar', areas: ['Civil Lines Sagar', 'Makronia', 'Marhatta Colony'] },
    { name: 'Rewa', areas: ['Rewa Town', 'Indirapuram Rewa', 'Govindgarh'] },
    { name: 'Satna', areas: ['Satna Town', 'Raipur Karchhana', 'Bijawar'] }
  ],
  'Maharashtra': [
    { name: 'Mumbai City', areas: ['Colaba', 'Fort', 'Churchgate', 'Bandra', 'Juhu', 'Andheri West', 'Powai', 'Worli', 'Lower Parel', 'Dadar', 'Kurla', 'Mulund'] },
    { name: 'Mumbai Suburban', areas: ['Thane', 'Borivali', 'Goregaon', 'Malad', 'Kandivali', 'Dahisar', 'Mira Road', 'Vasai-Virar', 'Dombivli', 'Kalyan'] },
    { name: 'Pune', areas: ['Koregaon Park', 'Baner', 'Viman Nagar', 'Aundh', 'Hinjewadi', 'Kothrud', 'Hadapsar', 'Wakad', 'Shivajinagar Pune', 'Kharadi', 'Magarpatta', 'Camp Pune'] },
    { name: 'Nagpur', areas: ['Dharampeth', 'Ramdaspeth', 'Sadar', 'Sitabuldi', 'Manish Nagar', 'Shankar Nagar Nagpur', 'Civil Lines Nagpur'] },
    { name: 'Nashik', areas: ['College Road', 'Gangapur Road', 'Cidco Nashik', 'Panchavati'] },
    { name: 'Aurangabad', areas: ['Cantonment', 'Cidco Aurangabad', 'N-11 Aurangabad'] },
    { name: 'Solapur', areas: ['Vijaypur Road', 'Kumtha Naka', 'Shelgi'] },
    { name: 'Kolhapur', areas: ['Shivaji Park', 'Rajarampuri', 'Kasaba Bavada'] },
    { name: 'Amravati', areas: ['Rajapeth', 'Camp Amravati', 'Badnera'] },
    { name: 'Navi Mumbai', areas: ['Vashi', 'Nerul', 'Kharghar', 'Belapur', 'Panvel', 'Airoli', 'Ghansoli'] }
  ],
  'Manipur': [
    { name: 'Imphal West', areas: ['Imphal Town', 'Paona Bazar', 'Khwairamband Bazar', 'Lamphel'] },
    { name: 'Imphal East', areas: ['Heingang', 'Porompat', 'Sagolband'] },
    { name: 'Bishnupur', areas: ['Bishnupur Town', 'Moirang'] },
    { name: 'Thoubal', areas: ['Thoubal Town', 'Kakching'] }
  ],
  'Meghalaya': [
    { name: 'East Khasi Hills', areas: ['Shillong', 'Laitumkhrah', 'Police Bazar', 'Rynjah', 'Mawlai'] },
    { name: 'West Khasi Hills', areas: ['Nongstoin', 'Mairang'] },
    { name: 'Ri Bhoi', areas: ['Nongpoh', 'Umsning'] },
    { name: 'East Jaintia Hills', areas: ['Jowai'] }
  ],
  'Mizoram': [
    { name: 'Aizawl', areas: ['Bawngkawn', 'Chanmari', 'Dawrpui', 'Ramhlun North', 'Zarkawt'] },
    { name: 'Lunglei', areas: ['Lunglei Town', 'Pukpui'] },
    { name: 'Champhai', areas: ['Champhai Town', 'Khawzawl'] }
  ],
  'Nagaland': [
    { name: 'Kohima', areas: ['Old Town Kohima', 'Razü', 'High School Colony', 'New NST Colony'] },
    { name: 'Dimapur', areas: ['Purana Bazar', 'Circular Road', 'G.S. Road', 'Midland Colony'] },
    { name: 'Mokokchung', areas: ['Mokokchung Town', 'Longtrok'] }
  ],
  'Odisha': [
    { name: 'Bhubaneswar', areas: ['Saheed Nagar', 'Patia', 'Vani Vihar', 'Nayapalli', 'Khandagiri', 'Chandrasekharpur', 'Infocity Bhubaneswar'] },
    { name: 'Cuttack', areas: ['Badambadi', 'College Square', 'Buxi Bazar', 'Ranihat'] },
    { name: 'Rourkela', areas: ['Uditnagar', 'Sector 1', 'Steel Town Rourkela', 'Chhend Colony'] },
    { name: 'Sambalpur', areas: ['Ainthapali', 'VSS Nagar', 'Dhanupali'] },
    { name: 'Puri', areas: ['Puri Town', 'Grand Road Puri', 'Marine Drive Puri'] },
    { name: 'Berhampur', areas: ['Engineering School Road', 'Ambapua', 'Lanjipalli'] }
  ],
  'Punjab': [
    { name: 'Ludhiana', areas: ['Sarabha Nagar', 'Model Town Ludhiana', 'Pakhowal Road', 'BRS Nagar', 'Civil Lines Ludhiana'] },
    { name: 'Amritsar', areas: ['Lawrence Road', 'Ranjit Avenue', 'Guru Nanak Nagar', 'Mall Road Amritsar'] },
    { name: 'Jalandhar', areas: ['Model Town Jalandhar', 'Guru Nanak Mission Chowk', 'Lajpat Nagar Jalandhar'] },
    { name: 'Mohali', areas: ['Phase 7', 'Phase 10', 'Kharar', 'Zirakpur', 'Aerocity'] },
    { name: 'Patiala', areas: ['Model Town Patiala', 'Leela Bhawan', 'New Patiala'] },
    { name: 'Bathinda', areas: ['Power House Road', 'Civil Lines Bathinda', 'Bibi Wala Road'] },
    { name: 'Pathankot', areas: ['Sarna Naga', 'Patel Nagar Pathankot'] }
  ],
  'Rajasthan': [
    { name: 'Jaipur', areas: ['Vaishali Nagar', 'Malviya Nagar', 'C-Scheme', 'Mansarovar', 'Jagatpura', 'Tonk Road', 'Adarsh Nagar', 'Sanganer', 'Raja Park', 'Civil Lines Jaipur'] },
    { name: 'Jodhpur', areas: ['Ratanada', 'Sardarpura', 'Shastri Nagar Jodhpur', 'Pal Road'] },
    { name: 'Kota', areas: ['Talwandi', 'Dadabari', 'Vigyan Nagar', 'Gumanpura'] },
    { name: 'Udaipur', areas: ['Fatehsagar Road', 'Hiran Magri', 'Madhuban', 'Bhuwana'] },
    { name: 'Ajmer', areas: ['Vaishali Nagar Ajmer', 'Pushkar Road', 'Madar Gate'] },
    { name: 'Bikaner', areas: ['Rani Bazar', 'Pawan Colony', 'Public Park'] },
    { name: 'Alwar', areas: ['Alwar Town', 'Bhiwadi', 'Behror'] },
    { name: 'Sikar', areas: ['Sikar Town', 'Fatehpur Shekhawati', 'Neem Ka Thana'] }
  ],
  'Sikkim': [
    { name: 'East Sikkim', areas: ['Gangtok MG Marg', 'Tadong', 'Ranipool', 'Singtam'] },
    { name: 'West Sikkim', areas: ['Gyalshing', 'Pelling', 'Yuksom'] },
    { name: 'North Sikkim', areas: ['Mangan', 'Lachen', 'Lachung'] },
    { name: 'South Sikkim', areas: ['Namchi', 'Jorethang', 'Ravangla'] }
  ],
  'Tamil Nadu': [
    { name: 'Chennai', areas: ['Anna Nagar', 'T Nagar', 'Adyar', 'Velachery', 'Nungambakkam', 'Mylapore', 'Perambur', 'Chromepet', 'Guindy', 'OMR Road', 'ECR Road', 'Perungudi', 'Sholinganallur', 'Ambattur'] },
    { name: 'Coimbatore', areas: ['RS Puram', 'Gandhipuram', 'Peelamedu', 'Saibaba Colony', 'Ramanathapuram'] },
    { name: 'Madurai', areas: ['Anna Nagar Madurai', 'SS Colony', 'Iyer Bungalow', 'Vilangudi'] },
    { name: 'Tiruchirappalli', areas: ['Thillai Nagar', 'KK Nagar Trichy', 'Srirangam'] },
    { name: 'Salem', areas: ['Fairlands', 'Shevapet', 'Gugai', 'Ammapet'] },
    { name: 'Tirunelveli', areas: ['Palayamkottai', 'Melapalayam', 'Junction Area'] },
    { name: 'Vellore', areas: ['Gandhi Nagar Vellore', 'Sathuvachari', 'Katpadi'] },
    { name: 'Erode', areas: ['Erode Town', 'Chithode', 'Bhavani'] },
    { name: 'Tiruppur', areas: ['Tiruppur Town', 'Avinashi', 'Kangeyam'] },
    { name: 'Kanchipuram', areas: ['Kanchipuram Town', 'Sriperumbudur', 'Maraimalai Nagar'] }
  ],
  'Telangana': [
    { name: 'Hyderabad', areas: ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur', 'Hitech City', 'Kondapur', 'Kukatpally', 'Ameerpet', 'SR Nagar', 'Secunderabad', 'Begumpet', 'Abids', 'Dilsukhnagar'] },
    { name: 'Warangal Urban', areas: ['Hanamkonda', 'Kazipet', 'Warangal Town'] },
    { name: 'Nizamabad', areas: ['Nizamabad Town', 'Yellareddy', 'Armoor'] },
    { name: 'Karimnagar', areas: ['Karimnagar Town', 'Kothapet', 'Peddapalli'] },
    { name: 'Khammam', areas: ['Khammam Town', 'Kothagudem', 'Bhadrachalam'] },
    { name: 'Rangareddy', areas: ['Shadnagar', 'Maheshwaram', 'Shamshabad', 'Attapur'] },
    { name: 'Medak', areas: ['Medak Town', 'Sangareddy', 'Toopran'] }
  ],
  'Tripura': [
    { name: 'West Tripura', areas: ['Agartala', 'Battala', 'Krishnanagar', 'Barjala'] },
    { name: 'East Tripura', areas: ['Sabroom', 'Belonia'] },
    { name: 'South Tripura', areas: ['Udaipur Tripura', 'Amarpur'] },
    { name: 'North Tripura', areas: ['Dharmanagar', 'Kailashahar'] }
  ],
  'Uttar Pradesh': [
    { name: 'Lucknow', areas: ['Hazratganj', 'Gomti Nagar', 'Alambagh', 'Vikas Nagar', 'Aliganj', 'Indira Nagar', 'Mahanagar', 'Kapoorthala', 'Jankipuram', 'Rajajipuram'] },
    { name: 'Kanpur', areas: ['Civil Lines Kanpur', 'Swaroop Nagar', 'Vijay Nagar Kanpur', 'Panki', 'Kidwai Nagar'] },
    { name: 'Agra', areas: ['Sanjay Place', 'Kamla Nagar Agra', 'Shahganj', 'Civil Lines Agra'] },
    { name: 'Varanasi', areas: ['Sigra', 'Lanka', 'Ravindrapuri', 'Godowlia'] },
    { name: 'Prayagraj', areas: ['Civil Lines Prayagraj', 'George Town', 'Naini', 'Phaphamau'] },
    { name: 'Meerut', areas: ['Shastri Nagar Meerut', 'Garh Road', 'Begum Pul', 'Kanker Khera'] },
    { name: 'Noida', areas: ['Sector 18', 'Sector 62', 'Sector 137', 'Greater Noida', 'Sector 50 Noida', 'Sector 15 Noida'] },
    { name: 'Ghaziabad', areas: ['Indirapuram', 'Vaishali', 'Raj Nagar', 'Kavinagar', 'Mohan Nagar'] },
    { name: 'Mathura', areas: ['Vrindavan', 'Mathura Cantt', 'Govardhan'] },
    { name: 'Bareilly', areas: ['Civil Lines Bareilly', 'CB Ganj', 'Rajendra Nagar Bareilly'] },
    { name: 'Aligarh', areas: ['Dodhpur', 'Civil Lines Aligarh', 'Ramghat Road'] },
    { name: 'Gorakhpur', areas: ['Golghar', 'Mohaddipur', 'Humayunpur'] }
  ],
  'Uttarakhand': [
    { name: 'Dehradun', areas: ['Rajpur Road', 'Saharanpur Road', 'EC Road', 'Dalanwala', 'Raipur', 'Clement Town', 'GMS Road', 'ISBT Dehradun'] },
    { name: 'Haridwar', areas: ['Har ki Pauri', 'Shivalik Nagar', 'Jwalapur', 'BHEL Haridwar'] },
    { name: 'Rishikesh', areas: ['Laxman Jhula', 'Tapovan', 'Ram Jhula', 'Muni Ki Reti'] },
    { name: 'Nainital', areas: ['Mall Road Nainital', 'Tallital', 'Bhowali'] },
    { name: 'Almora', areas: ['Almora Town', 'Ranikhet', 'Bageshwar'] },
    { name: 'Roorkee', areas: ['IIT Roorkee Area', 'Civil Lines Roorkee'] }
  ],
  'West Bengal': [
    { name: 'Kolkata', areas: ['Park Street', 'Salt Lake', 'New Town', 'Esplanade', 'Dhakuria', 'Gariahat', 'Kalighat', 'Ballygunge', 'EM Bypass', 'Howrah', 'Dum Dum', 'Rajarhat'] },
    { name: 'Howrah', areas: ['Shibpur', 'Bally', 'Santragachi', 'Liluah'] },
    { name: 'North 24 Parganas', areas: ['Barasat', 'Birati', 'Naihati', 'Titagarh'] },
    { name: 'South 24 Parganas', areas: ['Behala', 'Garia', 'Baruipur', 'Diamond Harbour'] },
    { name: 'Hooghly', areas: ['Uttarpara', 'Serampore', 'Chandannagar', 'Chinsurah'] },
    { name: 'Murshidabad', areas: ['Berhampore', 'Jangipur', 'Kandi'] },
    { name: 'Siliguri', areas: ['Siliguri Town', 'Matigara', 'Naxalbari', 'Pradhan Nagar'] },
    { name: 'Durgapur', areas: ['City Centre Durgapur', 'Bidhannagar', 'Benachiti'] },
    { name: 'Asansol', areas: ['Burnpur', 'Raniganj', 'Kulti'] }
  ],
  // Union Territories
  'Delhi': [
    { name: 'Central Delhi', areas: ['Connaught Place', 'Karol Bagh', 'Patel Nagar', 'Paharganj', 'Rajendra Place'] },
    { name: 'South Delhi', areas: ['Hauz Khas', 'Saket', 'Vasant Kunj', 'Greater Kailash', 'Lajpat Nagar', 'Malviya Nagar', 'Nehru Place', 'Okhla'] },
    { name: 'North Delhi', areas: ['Rohini', 'Pitampura', 'Model Town Delhi', 'Ashok Vihar', 'Shalimar Bagh'] },
    { name: 'West Delhi', areas: ['Janakpuri', 'Tilak Nagar', 'Uttam Nagar', 'Rajouri Garden', 'Punjabi Bagh'] },
    { name: 'East Delhi', areas: ['Preet Vihar', 'Laxmi Nagar', 'Krishna Nagar', 'Vivek Vihar', 'Shahdara'] },
    { name: 'New Delhi', areas: ['Lutyens Delhi', 'Khan Market', 'Diplomatic Enclave', 'Lodhi Colony'] },
    { name: 'North East Delhi', areas: ['Yamuna Vihar', 'Jafrabad', 'Karawal Nagar', 'Gokulpuri'] },
    { name: 'South West Delhi', areas: ['Dwarka', 'Palam', 'Mahipalpur', 'Vasant Vihar', 'RK Puram'] }
  ],
  'Jammu & Kashmir': [
    { name: 'Srinagar', areas: ['Lal Chowk', 'Residency Road', 'Dalgate', 'Rajbagh', 'Hyderpora', 'Bemina'] },
    { name: 'Jammu', areas: ['Gandhi Nagar', 'Bakshi Nagar', 'Trikuta Nagar', 'Canal Road'] },
    { name: 'Baramulla', areas: ['Baramulla Town', 'Sopore', 'Pattan'] },
    { name: 'Anantnag', areas: ['Anantnag Town', 'Bijbehara', 'Kokernag'] },
    { name: 'Pulwama', areas: ['Pulwama Town', 'Awantipora', 'Pampore'] },
    { name: 'Kulgam', areas: ['Kulgam Town', 'Qazigund'] }
  ],
  'Ladakh': [
    { name: 'Leh', areas: ['Leh Market', 'Changspa', 'Old Town Leh', 'Sheynam'] },
    { name: 'Kargil', areas: ['Kargil Town', 'Drass', 'Zanskar'] }
  ],
  'Puducherry': [
    { name: 'Puducherry', areas: ['White Town', 'Mission Street', 'Rock Beach', 'Lawspet', 'Pondicherry Town'] },
    { name: 'Karaikal', areas: ['Karaikal Town', 'Thirunallar'] }
  ],
  'Chandigarh': [
    { name: 'Chandigarh', areas: ['Sector 17', 'Sector 22', 'Sector 35', 'Sector 43', 'Elante Mall Area', 'Sector 8 Chandigarh', 'IT Park Chandigarh'] }
  ],
  'Andaman & Nicobar Islands': [
    { name: 'South Andaman', areas: ['Port Blair', 'Havelock Island', 'Neil Island', 'Wandoor', 'Corbyns Cove'] },
    { name: 'North and Middle Andaman', areas: ['Diglipur', 'Rangat', 'Mayabunder'] }
  ],
  'Dadra & Nagar Haveli': [
    { name: 'Dadra & Nagar Haveli', areas: ['Silvassa', 'Amli', 'Masat', 'Naroli'] }
  ],
  'Lakshadweep': [
    { name: 'Lakshadweep', areas: ['Kavaratti', 'Agatti', 'Minicoy', 'Andrott'] }
  ]
};

// Build flat array of nodes
const allNodes = [...stateNodes];

Object.entries(districtData).forEach(([stateName, districts]) => {
  const stateId = stateIds[stateName];
  if (!stateId) return;

  districts.forEach(district => {
    const distId = mkId();
    allNodes.push({ id: distId, parentId: stateId, name: district.name, level: 'DISTRICT' });

    (district.areas || []).forEach(area => {
      allNodes.push({ id: mkId(), parentId: distId, name: area, level: 'VILLAGE' });
    });
  });
});

export const INDIA_LOCATIONS = allNodes;
export default INDIA_LOCATIONS;
