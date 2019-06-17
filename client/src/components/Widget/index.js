import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardBody, CardFooter } from 'reactstrap';
import classNames from 'classnames';
import { mapToCssModules } from 'reactstrap/lib/utils';

const propTypes = {
  header: PropTypes.string,
  mainText: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.string,
  footer: PropTypes.bool,
  link: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  collapse: PropTypes.bool,
};

const defaultProps = {
  header: '$1,999.50',
  mainText: 'Income',
  icon: 'fa fa-cogs',
  color: 'primary',
  variant: '0',
  link: '#',
  collapse: false
};

class Widget extends Component {
  render() {
    const { collapse, className, cssModule, header, mainText, icon, color, footer, link, children, variant, ...attributes } = this.props;

    // demo purposes only
    const padding = (variant === '0' ? { card: 'p-3', icon: 'p-3', lead: 'mt-2' } : (variant === '1' ? {
      card: 'p-0', icon: 'p-4', lead: 'pt-3',
    } : { card: 'p-0', icon: 'p-4 px-5', lead: 'pt-3' }));

    const card = { style: 'clearfix', color: color, icon: icon, classes: '' };
    card.classes = mapToCssModules(classNames(className, card.style, padding.card), cssModule);

    const lead = { style: 'h5 mb-0', color: color, classes: '' };
    lead.classes = classNames(lead.style, 'text-' + card.color, padding.lead);

    const blockIcon = function (icon) {
      const classes = classNames(icon, 'bg-' + card.color, padding.icon, 'font-2xl mr-3 float-left');
      return (<i className={classes}></i>);
    };

    const cardFooter = function () {
      if (footer) {
        return (
          <CardFooter className="px-3 py-2">
            <a className="font-weight-bold font-xs btn-block text-muted" href={link}>View More
              <i className="fa fa-angle-right float-right font-lg"></i></a>
          </CardFooter>
        );
      }
    };

    return (
      <Card style={{margin:0, padding: 0}}>
        <CardBody style={{margin:0, padding: 0}} className={card.classes} {...attributes}>
            <Row>
                <Col xs="10">
                    {blockIcon(card.icon)}
                    <div className={lead.classes}>{header}</div>
                    <div style={{marginTop: 5}} className="text-muted text-uppercase font-weight-bold font-xs">{mainText}</div>
                </Col>

                <Col xs="2">
                    {!collapse ? 
                    <i style={{marginTop: 10}} className="fa fa-angle-right fa-2x float-right"></i>
                    :
                    <i style={{marginTop: 10}} className="fa fa-angle-down fa-2x float-right"></i>
                    }
                </Col>
            </Row>
         
        </CardBody>
        {cardFooter()}
      </Card>
    );
  }
}

Widget.propTypes = propTypes;
Widget.defaultProps = defaultProps;

export default Widget;