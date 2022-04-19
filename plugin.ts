import { createVariableDeclaration } from "./node_modules/typescript/lib/typescript";

const app = ui.createProjectPanelSection();

// section for active varaint information
const section = new ui.Section('aktive Variante');
app.add(section);
const actualVariantArea = new ui.LabeledValue('Fläche Total', '-  m²');
const actualVariantVolume = new ui.LabeledValue('Volume Total', '- m³');
section.add(actualVariantArea);
section.add(actualVariantVolume);

// content of variant comparsion 
const barChartSectionVolume = new ui.Container();
const barChartSectionArea = new ui.Container();
app.add(new ui.Separator());
app.add(barChartSectionVolume);
app.add(new ui.Separator());
app.add(barChartSectionArea);

const createVariantBarChart = (name: string, values: any) => {

    const barChart = new ui.BarChart(name, 'm³');
    for (let item of values) {
        barChart.addSegment(item.name, item.value);
    }
    return barChart;
} 

data.onProjectSelect.subscribe(project => {
    if (project) {

        // get informations of active variant 
        project.onVariantSelect.subscribe(variant => {
            if (variant) {
                section.name = variant.name;
                actualVariantArea.value = Math.round(variant.floorArea).toLocaleString('de-CH')  + ' m²';
                actualVariantVolume.value = Math.round(variant.volume).toLocaleString('de-CH') + ' m³';
            } else {
                section.name = 'keine aktive Variante';
                actualVariantArea.value = '-  m²';
                actualVariantVolume.value = '- m³';
            }
        })

        // get informations of all variants
        project.getVariants().then(projectVars => {
            barChartSectionVolume.removeAllChildren();
            barChartSectionArea.removeAllChildren();

            // get max values of floor and volume for charting
            let _maxVolume = 0;
            let _maxFloorArea = 0;
            for (let varData of projectVars) {
                if (varData.volume > _maxVolume) {
                    _maxVolume = varData.volume;
                } 
                if (varData.floorArea > _maxFloorArea) {
                    _maxFloorArea = varData.floorArea;
                }
            }
            const maxVolume = _maxVolume;
            const maxFloorArea = _maxFloorArea;

            // list all variant volumes 
            barChartSectionVolume.add(new ui.Paragraph('Variantenvergleich Volumen'))
            for (let varData of projectVars) {
                // bar chart data
                const varVol = [{name:'Total Volume', value:varData.volume}];

                // create labeled values instead of bar chart
                barChartSectionVolume.add(new ui.LabeledValue(varData.name, Math.round(varData.volume).toLocaleString('de-CH') + ' m³'))
                // barChartSection.add(createVariantBarChart(varData.name, varVol));
            }

            // list all variant floor areas 
            barChartSectionArea.add(new ui.Paragraph('Variantenvergleich Fläche'))
            for (let varData of projectVars) {
                // bar chart data
                const varVol = [{name:'Total Volume', value:varData.floorArea}];

                // create labeled values instead of bar chart
                barChartSectionArea.add(new ui.LabeledValue(varData.name, Math.round(varData.floorArea).toLocaleString('de-CH') + ' m²'))
                // barChartSection.add(createVariantBarChart(varData.name, varVol));
            }

        });
    }
})


