//By Konstantine Kirkitadze
var getMovie = function (name) {
    return fetch("http://www.omdbapi.com/?t=" + name + "&apikey=540d1872").then(function (res) {
        return res.json();
    });
};
var getCountry = function (name) {
    return fetch("https://restcountries.eu/rest/v2/name/" + name + "?fullText=true").then(function (res) { return res.json(); });
};
var logger = function (p) {
    p.then(function (r) { return console.log(r); });
};
// 1. დაწერეთ ფუნქცია, რომელსაც გადავცემთ ფილმის სახელს და გვეტყვის რამდენი წლის წინ გამოვიდა ეს ფილმი.
var yearsPassed = function (movieName) {
    return getMovie(movieName).then(function (m) { return new Date().getFullYear() - m.Year; });
};
logger(yearsPassed("Avatar"));
// // 2. დაწერეთ ფუნქცია, რომელსაც გადავცემთ ფილმის სახელს და დაგვიბრუნებს ამ ფილმის მსახიობების სახელების მასივს (გვარების გარეშე)
var getNamesOnly = function (movieName) {
    return getMovie(movieName).then(function (m) { var _a; return (_a = m.Actors) === null || _a === void 0 ? void 0 : _a.split(", ").map(function (m) { return m.split(" ")[0]; }); });
};
logger(getNamesOnly("Gzaabneulni"));
// 3. დაწერეთ ფუნქცია, რომელიც დააბრუნებს იმ ქვეყნის ვალუტას, საიდანაც თქვენი  ერთერთი საყვარელი ფილმია. (თუ რამდენიმე ქვეყანაა ფილმზე მითითებული,  ავიღოთ პირველი)
var getMovieCountryCurrency = function (movieName) {
    return getMovie(movieName)
        .then(function (res) { var _a; return (_a = res.Country) === null || _a === void 0 ? void 0 : _a.split(", ")[0]; })
        .then(function (el) { return getCountry(el); })
        .then(function (el) { var _a, _b; return (_b = (_a = el[0]) === null || _a === void 0 ? void 0 : _a.currencies[0]) === null || _b === void 0 ? void 0 : _b.code; });
};
logger(getMovieCountryCurrency('avatar'));
// 5. დაწერეთ ფუნქცია, რომელსაც გადავცემთ 3 ფილმის სახელს, და დაგვიბრუნებს იმ ქვეყნების მოსახლეობების ჯამს, საიდანაც ეს ფილმებია. (თუ რამდენიმე ქვეყანაა ფილმზე მითითებული, ავიღოთ პირველი)
var parseCountry = function (countries) { return countries.split(", ")[0]; };
var getTotalPopulation = function (_a) {
    var movieA = _a[0], movieB = _a[1], movieC = _a[2];
    return Promise.all([movieA, movieB, movieC]).then(function (_a) {
        var a = _a[0], b = _a[1], c = _a[2];
        return Promise.all([
            getCountry(parseCountry(a.Country)),
            getCountry(parseCountry(b.Country)),
            getCountry(parseCountry(c.Country)),
        ]).then(function (allCountries) {
            return allCountries.reduce(function (acc, curr) { return (acc += curr[0].population); }, 0);
        });
    });
};
logger(getTotalPopulation([
    getMovie("Disco Dancer"),
    getMovie("Gzaabneulni"),
    getMovie("Lord of the Rings"),
]));
// 4. დაწერეთ ფუნქცია, რომელსაც გადავცემთ 3 ფილმის სახელს, და გვეტყვის ჯამში რამდენი საათი და რამდენი წუთია ყველა ფილმის ხანგრძლივობა ერთად.
var getTotalDuration = function (_a) {
    var movieA = _a[0], movieB = _a[1], movieC = _a[2];
    return Promise.all([movieA, movieB, movieC])
        .then(function (arr) {
        return arr
            .map(function (x) { return parseInt(x.Runtime); })
            .reduce(function (acc, curr) { return (acc += curr); }, 0);
    })
        .then(function (minutes) { return Math.floor(minutes / 60) + " hours, " + minutes % 60 + " minutes"; });
};
logger(getTotalDuration([
    getMovie("Disco Dancer"),
    getMovie("Gzaabneulni"),
    getMovie("Lord of the Rings"),
]));
