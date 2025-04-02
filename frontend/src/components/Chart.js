
import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { COLORS } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';

const screenWidth = Dimensions.get('window').width - 40;

const Chart = ({
    type = 'bar',
    data,
    title,
    height = 220,
    style
}) => {
    if (!data) return null;

    const chartConfig = {
        backgroundGradientFrom: COLORS.white,
        backgroundGradientTo: COLORS.white,
        color: (opacity = 1) => `rgba(76, 102, 238, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.7,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
        labelColor: () => COLORS.gray,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: COLORS.primary,
        },
    };

    const renderChart = () => {
        switch (type) {
            case 'bar':
                return (
                    <BarChart
                        data={data}
                        width={screenWidth}
                        height={height}
                        chartConfig={chartConfig}
                        verticalLabelRotation={30}
                        fromZero
                        showValuesOnTopOfBars
                        withInnerLines={false}
                    />
                );
            case 'line':
                return (
                    <LineChart
                        data={data}
                        width={screenWidth}
                        height={height}
                        chartConfig={chartConfig}
                        bezier
                        fromZero
                        withDots
                        withInnerLines={false}
                    />
                );
            case 'pie':
                return (
                    <PieChart
                        data={data}
                        width={screenWidth}
                        height={height}
                        chartConfig={chartConfig}
                        accessor="value"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                    />
                );
            default:
                return null;
        }
    };

    return (
        <View style={[styles.container, style]}>
            {title && <Text style={styles.title}>{title}</Text>}
            <View style={styles.chartContainer}>{renderChart()}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: COLORS.dark,
        paddingHorizontal: 8,
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default Chart;