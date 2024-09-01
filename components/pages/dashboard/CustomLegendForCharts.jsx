import classes from "./CustomLegendForCharts.module.scss";

const CustomLegendForCharts = (props) => {
    const {payload} = props;
    return (
        <ul className={classes.Ul}>
            {
                payload.map((entry, index) => {
                    return (
                        <li style={{color: entry.color}} className={classes.Item} key={`item-${index}`}>{entry.value}</li>
                    )
                })
            }
        </ul>
    );
}

export default CustomLegendForCharts;