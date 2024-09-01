import React, {PureComponent} from "react";
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    ResponsiveContainer,
    Label,
} from "recharts";

import CustomLegendForCharts from "./CustomLegendForCharts";

class ProjectsChart extends PureComponent {
    render() {
        // The Data
        const data = this.props.data;

        // Colors Palette for the Chart
        const COLORS = this.props.colors;

        // Chart's Name
        const chartsName = this.props.chartsName;

        return (
            <ResponsiveContainer>
                <PieChart
                    onMouseEnter={this.onPieEnter}
                >
                    <Pie
                        data={data}
                        innerRadius={70}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        startAngle={-45}
                        endAngle={315}
                        dataKey="value"
                        cornerRadius={10}
                        label={true}
                    >
                        <Label value={chartsName} position="center"/>
                        {data.map((entry, index) => {
                            return (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            );
                        })}
                    </Pie>
                    <Legend
                        content={<CustomLegendForCharts payload={data}/>}
                    />
                </PieChart>
            </ResponsiveContainer>
        );
    }
}

export default ProjectsChart;


