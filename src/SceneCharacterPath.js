// @flow

import React from 'react';
import type { PathSegment } from './types';
import type { WorldName } from './Worlds';

type SceneCharacterPathProps = {
    path: Array<PathSegment>,
    world: WorldName
};

export default class SceneCharacterPath extends React.PureComponent<SceneCharacterPathProps, {}> {
    render() {
        return (
            <React.Fragment>
                {this.props.path.map((pathSegment, i) => (
                    <line
                        className={`Scene__path-line Scene__path-line--${this.props.world}`}
                        key={`path-${i}`}
                        x1={pathSegment.x1}
                        y1={pathSegment.y1}
                        x2={pathSegment.x2}
                        y2={pathSegment.y2}
                    />
                ))}
            </React.Fragment>
        );
    }
}
