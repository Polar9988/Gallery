const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-6B8CA1AE-595B-49EB-85B2-00D1989D5A11';

fetch(url)
    .then(response => response.json())
    .then(data => {
        const locations = data.records.location;

        const weatherData = {};

        locations.forEach(location => {
            const locationName = location.locationName;
            const weatherElements = location.weatherElement;
            const startTime = weatherElements[0].time[0].startTime;
            const endTime = weatherElements[0].time[0].endTime.split(' ')[1];
            let maxTemperature = '';
            let minTemperature = '';
            let currentWeather = '';
            let rainProbability = '';
            let comfortLevel = '';
            let weatherIcon = '';

            weatherElements.forEach(element => {
                if (element.elementName === 'MaxT') {
                    maxTemperature = element.time[0].parameter.parameterName;
                }
                if (element.elementName === 'MinT') {
                    minTemperature = element.time[0].parameter.parameterName;
                }
                if (element.elementName === 'Wx') {
                    currentWeather = element.time[0].parameter.parameterName;
                    weatherIcon = element.time[0].parameter.parameterValue;
                }
                if (element.elementName === 'PoP') {
                    rainProbability = element.time[0].parameter.parameterName;
                }
                if (element.elementName === 'CI') {
                    comfortLevel = element.time[0].parameter.parameterName;
                }
            });

            weatherData[locationName] = {
                startTime,
                endTime,
                maxTemperature,
                minTemperature,
                currentWeather,
                rainProbability,
                comfortLevel,
                weatherIcon
            };
        });

        const weatherInfoContainer = document.getElementById('cols');

        function showWeatherByRegion(region) {
            weatherInfoContainer.innerHTML = ''; 

            region.forEach(locationName => {
                const weatherInfoHtml = `
                    <div class="col" ontouchstart="event.preventDefault(); event.stopPropagation(); this.classList.toggle('hover');">
                        <div class="container">
                            <div class="front" style="background-image: url(https://unsplash.it/500/500/)">
                                <div class="inner">
                                    <img src="./img/${weatherData[locationName].weatherIcon.padStart(2, '0')}.svg"></img>
                                    <p>${locationName}</p>
                                    <span>${weatherData[locationName].startTime} 至 ${weatherData[locationName].endTime}</span>
                                </div>
                            </div>
                            <div class="back">
                                <div class="inner">
                                    
                                    <p>現在天氣：${weatherData[locationName].currentWeather}</p>
                                    <p>今日最高溫：${weatherData[locationName].maxTemperature} °C</p>
                                    <p>今日最低溫：${weatherData[locationName].minTemperature} °C</p>
                                    <p>降雨機率：${weatherData[locationName].rainProbability} %</p>
                                    <p>舒適度：${weatherData[locationName].comfortLevel}</p>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                weatherInfoContainer.innerHTML += weatherInfoHtml;
            });
        }

        const navItems = document.querySelectorAll('#navbar ul li');
        navItems.forEach(item => {
            item.addEventListener('click', function () {
                const selectedArea = this.textContent; 


                weatherInfoContainer.innerHTML = '';


                switch (selectedArea) {
                    case '全部地區':
                        showAllAreasWeather();
                        break;
                    case '北部地區':
                        showWeatherByRegion(['臺北市', '新北市', '基隆市', '桃園市', '新竹市', '新竹縣', '宜蘭縣']);
                        break;
                    case '中部地區':
                        showWeatherByRegion(['臺中市', '苗栗縣', '彰化縣', '南投縣', '雲林縣']);
                        break;
                    case '南部地區':
                        showWeatherByRegion(['高雄市', '嘉義市', '嘉義縣', '臺南市', '屏東縣', '澎湖縣']);
                        break;
                    case '東部地區':
                        showWeatherByRegion(['花蓮縣', '臺東縣']);
                        break;
                    case '離島地區':
                        showWeatherByRegion(['金門縣', '連江縣']);
                    default:
                        break;
                }
            });
        });

        // 一開始顯示全部地區的天氣資訊
        showAllAreasWeather();

        // 全部地區的天氣
        function showAllAreasWeather() {
            weatherInfoContainer.innerHTML = ''; 

            const customOrder = ['臺北市', '新北市', '基隆市', '桃園市', '新竹市', '新竹縣', '宜蘭縣', '臺中市', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '澎湖縣', '花蓮縣', '臺東縣', '金門縣', '連江縣'];
            

            customOrder.forEach(locationName => {
                fetchUnsplashPhoto(locationName, (imageUrl, attribution) => {
                    const weatherInfoHtml = `
                        <div class="col" ontouchstart="event.preventDefault(); event.stopPropagation(); this.classList.toggle('hover');" data-aos="fade-up" data-aos-easing="linear"  data-aos-duration="2000">
                            <div class="container" >
                                <div class="front" style="background-image: url(${imageUrl})">
                                    <div class="inner">
                                        <img src="./img/${weatherData[locationName].weatherIcon.padStart(2, '0')}.svg"></img>
                                        <p>${locationName}</p>
                                        <span>${weatherData[locationName].startTime} 至 ${weatherData[locationName].endTime}</span>
                                    </div>
                                </div>
                                <div class="back">
                                    <div class="inner">
                                        
                                        <p>現在天氣：${weatherData[locationName].currentWeather}</p>
                                        <p>今日最高溫：${weatherData[locationName].maxTemperature} °C</p>
                                        <p>今日最低溫：${weatherData[locationName].minTemperature} °C</p>
                                        <p>降雨機率：${weatherData[locationName].rainProbability} %</p>
                                        <p>舒適度：${weatherData[locationName].comfortLevel}</p>
                                        <p>${attribution}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    weatherInfoContainer.insertAdjacentHTML('beforeend', weatherInfoHtml);
                    
                    let cardsAdded = 0;
                    const totalCards = customOrder.length;
                    cardsAdded++;
                    if (cardsAdded === totalCards) {
                        setTimeout(() => {
                            AOS.init({
                                once: false,
                                mirror: false,
                                offset: 50
                            });
                        }, 100);
                    }
                });
            });
        }
    })
    .catch(error => {
        console.error('發生錯誤:', error);
    });

const mybutton = document.querySelector(".btn.top");

window.addEventListener('scroll', scrollFunction, { passive: true });

function scrollFunction() {
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}


// 到頂部
function topFunction() {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Chrome, Firefox, IE and Opera
}

const defaultBackgroundUrl = 'https://unsplash.it/500/500/?category=taiwan';

function fetchUnsplashPhoto(locationName, callback) {
    const accessKey = 'KJ2T0FuvXcPxtbcylQ9VAdgBJiDteAk2a7v0gJVORUM';
    const searchTerm = encodeURIComponent(locationName);

    const pictureurl = `https://api.unsplash.com/photos/random?query=${searchTerm}&client_id=${accessKey}`;

    fetch(pictureurl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const imageUrl = data.urls.regular; // 獲取圖片的 regular 大小 URL
            const photographerName = data.user.name; // 獲取攝影師的名字

            const attribution = `Photo by ${photographerName} on Unsplash`;

            const img = new Image();
            img.onload = function () {
                callback(imageUrl, attribution);
            };
            img.onerror = function () {
                callback(defaultBackgroundUrl, '');
            };
            img.src = imageUrl;
        })
        .catch(error => {
            console.error('Error fetching Unsplash photo:', error.message);
            callback(defaultBackgroundUrl, '');
        });
}



