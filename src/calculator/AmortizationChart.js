import React, {Component} from 'react';

class AmortizationChart extends Component {

    render() {
        let items = this.props.data.map((year, index) => {
            let principalStyle = {
                flex: year.principalY, WebkitFlex: year.principalY
            };
            let interestStyle = {
                flex: year.interestY, WebkitFlex: year.interestY
            };
            let principalCalc = Math.round(year.principalY).toLocaleString();
            let interestCalc = Math.round(year.interestY).toLocaleString();
            let balanceCalc = Math.round(year.balance).toLocaleString();
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="money principal-text">{principalCalc}</td>
                    <td className="graph">
                        <div className="flex">
                            <div className={"bar principal"} style={principalStyle}></div>
                            <div className={"bar interest"} style={interestStyle}></div>
                        </div>
                    </td>
                    <td className="money interest-text">{interestCalc}</td>
                    <td className="money">{balanceCalc}</td>
                </tr>
            );
        });

        return (
            <table>
                <thead>
                <tr>
                    <th>Year</th>
                    <th className="principal-text">Principal</th>
                    <th className="graph"></th>
                    <th className="interest-text">Interest</th>
                    <th>Balance</th>
                </tr>
                </thead>
                <tbody>{items}</tbody>
            </table>
        );
    }
}

export default AmortizationChart;

