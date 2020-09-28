// @flow

import * as React from 'react';
import { Nav, Tab } from 'react-bootstrap';

import CommandPaletteCategory from './CommandPaletteCategory';

type CommandPaletteProps = {
    children?: React.Node,
    defaultActiveKey: string,
    id: string
};

export default class CommandPalette extends React.Component<CommandPaletteProps, {}> {
    render() {
        return (
            <Tab.Container id={this.props.id} defaultActiveKey={this.props.defaultActiveKey}>
                <Nav variant='tabs'>
                    {React.Children.map(this.props.children, (category: CommandPaletteCategory)=>{
                        return (
                            <Nav.Item>
                                <Nav.Link eventKey={category.props.eventKey}>{category.props.title}</Nav.Link>
                            </Nav.Item>
                        );
                    })}
                </Nav>
                <Tab.Content>
                    {this.props.children}
                </Tab.Content>
            </Tab.Container>
        );
    }
}
