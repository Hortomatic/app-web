'use strict';

import React from 'react';
import Immutable from 'immutable';

/**
 * props.format takes a string composed of the following:
 * NNNN = 
 * GGGG = genus (e.g. Quercus)
 * GG = abbreviated genus (e.g.  Q.)
 * SS = species epithet (e.g. robla)
 * SSSS = species and sub-species epithets ()
 * CCCC = cultivar 
 */

export const PlantName = React.createClass({
	propTypes: {
		model: React.PropTypes.instanceOf(Immutable.Map)
	,	format: React.PropTypes.string 
	}

,	getDefaultProps(){
		return {
			format: 'CROP CV'
		}
	}

/*,	format(){
		var name = [];
		var rank = plant.get('rank') 
		|| plant.get('cultivar') 
			? 'cultivar' 
			: plant.get('scientific') && plant.get('scientific').match(/^[a-z]+\s[a-z]+/i) 
				? 'species' 
				: 'genus';

		if(rank==='cultivar' || rank==='species' || rank==='genus'){
      name.push(<span className="binomial">{plant.get('scientific')}</span>)
    }
    if(rank==='cultivar'){
      name.push(<span className="cultivar">{plant.get('cultivar')}</span>);
    }
    return (
      <span className="plant-name-scientific">
        {name}
      </span>
    );
	}*/

	format: 'NNNN CCCC'

,	render() {
		return (
			<span className="PlantName">
				{this.format(this.props.model)}
			</span>
		);
	}
});
