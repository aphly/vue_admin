<template>
    <div class="adminMain">
        <div class="adminContext">
            home
            <div class="worldMap" ref="worldMap">

            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref,onMounted} from 'vue'
    import * as echarts from 'echarts'
    import world from "@/assets/map/world.json"
    console.log(world.features)
    let nameIso = []
    world.features.forEach(item => {
        if(item.properties.name){
            nameIso.push({
                name:item.properties.name,
                iso:"",
            })
        }
    });
    let str = JSON.stringify(nameIso)

    function downloadJSON(jsonStr) {
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = href;
        downloadLink.download = 'data.json';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(href);
    }

    //downloadJSON(str)

    let worldMap = ref(null)
    onMounted(() => {
        let myChart = echarts.init(worldMap.value);
        let option = {
            tooltip: {
                trigger: 'item',
                borderWidth:0,
                formatter: '{b}<br/>{c}'
            },
            visualMap: {
                show: false,
                min: 0,
                max: 50000,
                text: ['High', 'Low'],
                realtime: false,
                calculable: true,
                inRange: {
                    color: ['lightskyblue', 'yellow', 'orangered']
                }
            },
            series: [
                {
                    name: '香港18区人口密度',
                    type: 'map',
                    map: 'World',
                    label: {
                        show: false
                    },
                    itemStyle: {
                        normal: {
                            borderWidth: 0
                        },
                        emphasis: {
                            borderWidth: 0
                        }
                    },
                    data: [
                        { name:"中国", value: 1 },
                    ],
                    nameMap: {
                        'China':'中国'
                    }
                }
            ]
        };
        echarts.registerMap('World', world);
        myChart.setOption(option)

    })
    async function mapLoad(){
        myChart.showLoading();
        myChart.hideLoading();
    }
    //mapLoad()
</script>

<style lang="scss" scoped>
.worldMap{
    width: 100%;
    height:700px;
}
</style>