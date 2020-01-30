'use strict';

//deps
import React from 'react';
var _ = require('lodash');
var TransitionGroup = require('react-addons-css-transition-group');

//ui components
var {Panel, Button} = require('components/Button');




require('./FirstRun.css');

const FirstRun = React.createClass({

	mixins: [
		Morearty.Mixin
	,	AppContext.Mixin
	]

,	getDefaultState(){
		return Immutable.fromJS({
			showTopNav: false
		,	step: 0
		,	email: ''
		,	demoDataStatus: undefined
		});
	}

,	steps: ['welcome', 'email', 'hints', 'testdata', 'offyougo']

,	nextStep(){
		//show top nav after email step
		if(this.$get('step')===1){
			this.$set('showTopNav', true); 
		}
		this.$set('step', this.$get('step')+1);
	}

,	finish(){
		this.context.morearty.getBinding().set(['user', 'onboarded'], true); 
		this.getRouter().transitionTo('home');
	}

,	addDemoData(){
		this.$('demoDataStatus', 0);

		var data = require('./demoData.json');
	  var db = new PouchDB(settings.pouch_name);
	  
	  var flatDocs = [].concat( _.values(data.stores.planting) )
	  	.concat( _.values(data.stores.place) )
	  	.concat( _.values(data.stores.seed) )
	  	.concat( _.values(data.stores.plant) )
	  	.map(doc=>_.omit(doc, '_rev'))
	  ;

	  console.log('Putting docs', flatDocs);

	  db.bulkDocs(flatDocs)
	  .then(res=>{
	  	console.log('Imported data', res)
	  	this.$set('demoDataStatus', 1);
	  	this.nextStep();
	  })
	  .catch(err=>{console.error(err); alert('Oops, something went wrong loading in the data. Told you it was a prototype! Refresh to try again, please send feedback if you\'re stuck!')})


	}

,	handleEmailChange(ev){
		this.$set('email', ev.target.value);
	}

,	render() {
		console.log('Rendering FirstRun at keypath', this.$default().getPath(), this.$default().toJS());
		return (
			<div className="FirstRun App-mainView">
				<object 
				height={310}
				width={260}
				data={require('assets/gnome.svg')} 
				type="image/svg+xml" 
				className="FirstRun-Gnome" />
				<TransitionGroup className="FirstRun-stepsContainer" transitionName="FirstRun-bubbleTransition" component="div">
					{this[this.steps[this.$get('step')]]()}
				</TransitionGroup>
			</div>
		);
	}

,	welcome(){
		return (
		<div className="FirstRun-step" key="welcome">
		<div className="FirstRun-bubble FirstRun-introBubble">
		  <div className="FirstRun-bubble-content">
		  	<h1 className="FirstRun-bubble-Title FirstRun-introBubble-title">Welcome to Hortomatic!</h1>
		  	<p className="primary">
		  		Hortomatic helps you plan your garden and track your crops.
		  	</p>
		  	<p>
		  		<span style={{fontWeight:700}}>This is an initial prototype. </span> 
		  		At this stage Hortomatic is a basic garden journal.
		  		The future will bring more fun tools to help beginning gardeners learn
		  		and experienced gardeners hone their craft.
		  	</p>
		  	<p style={{fontSize:16}}>
		  		WARNING: Here be dragons! As a prototype there'll almost certainly be 
		  		bugs and new features could break things without warning. 
		  	</p>
		  	<p style={{fontSize:16}}>
		  		If that all sounds too scary, don't feel bad! Go back to the 
		  		Hortomatic <a href="http://hortomatic.com">home page</a> and leave 
		  		your email address;	I'll get back to you when things are ready for you to join in the fun.
		  	</p>
		  </div>
		  <ButtonPanel className="FirstRun-bubble-buttonPanel">
		  	<Button 
		  	className="FirstRun-bubble-button-primary" 
		  	iconClass="fa fa-chevron-right" 
		  	kind="text" 
		  	align="right" 
		  	label={this.l10n('Onboarding-letsGo')}
		  	onClick={()=>{ this.nextStep();} } />
		  </ButtonPanel>
		</div>
		</div>);
	}

, email(){
		return (
		<div className="FirstRun-step" key="email">
		<div className="FirstRun-bubble FirstRun-emailCapture">
			<div className="FirstRun-bubble-content">
		  	<h1 className="FirstRun-bubble-Title FirstRun-introBubble-title">Let's stay in touch!</h1>
		  	<p className="primary">
					Enter your email here if you want to stay up to date on Hortomatic's development. 
				</p>
				<p>
					No pressure! It's just so we can keep early-adopters informed of new
					features as they're released.
				</p>
				<div id="mc_embed_signup">
				<form ref="signupForm" action="//hortomatic.us10.list-manage.com/subscribe/post?u=8be31babd7a74683a3ce5683f&amp;id=030ab50253" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
					<input type="email" name="EMAIL"  placeholder="you@yours.com" id="mce-EMAIL" ref="userEmail" onChange={this.handleEmailChange} />
				</form>
		  	</div>
		  	<p style={{fontSize:16}}>
		  		I hate spam. You'll get an occasional email as the project develops, and nothing more. You can unsubscribe any time and 
		  		your email won't be used for anything else.
		  	</p>
		  </div>
		  <ButtonPanel className="FirstRun-bubble-buttonPanel">
		  	{!this.$get('email')
		  	?	<Button 
			  	className="FirstRun-bubble-button-primary" 
			  	iconClass="fa fa-chevron-right" 
			  	kind="text" 
			  	align="right" 
			  	label="Nah. Let's move on..."
			  	onClick={()=>{ this.nextStep(); } } />
			  : <Button 
			  	className="FirstRun-bubble-button-primary" 
			  	iconClass="fa fa-chevron-right" 
			  	kind="text" 
			  	align="right" 
			  	label="Go for it! What next?"
			  	onClick={()=>{ this.refs.signupForm.submit(); this.nextStep(); } } />
			  }
		  </ButtonPanel>
		</div>
		</div>);
	}

,	hints(){

		return (
		<div className="FirstRun-step" key="hints">
		<div className="FirstRun-bubble FirstRun-hints">
			<div className="FirstRun-bubble-content">
		  	<h1 className="FirstRun-bubble-Title">Offline, you so fine <i className="fa fa-heart" /></h1>
		  	<p className="primary">
		  		Hortomatic runs entirely in your browser, and it runs just fine
		  		even if you're offline.
		  	</p>

		  	<p>
					Soon you'll be able to register an account and your data will stay in sync 
		  		accross all your devices. In this prototype, your data is stuck in this browser.
		  	</p>

		  	<div className="FirstRun-hints-hint">
		  		See that menu above? Click the <i className="fa fa-arrow-down" /> icon
		  		to manage your data. Give it a go, you can come back here when you're ready.
		  	</div>

		  </div>
		  <ButtonPanel className="FirstRun-bubble-buttonPanel">
			  <Button 
		  	className="FirstRun-bubble-button-primary" 
		  	iconClass="fa fa-chevron-right" 
		  	kind="text" 
		  	align="right" 
		  	label="Got it, what's next?"
		  	onClick={()=>{ 
		  		this.nextStep();
		  	}} />
		  </ButtonPanel>
		</div>
		</div>);		
	}

,	testdata(){

		return (
		<div className="FirstRun-step" key="testdata">
		<div className="FirstRun-bubble FirstRun-hints">
			<div className="FirstRun-bubble-content">
		  	<h1 className="FirstRun-bubble-Title">Want to play?</h1>
		  	<p className="primary">
		  		If you want to get a feel for Hortomatic, I could load up some test data for you...
		  	</p>

		  	<p>
		  		In this prototype, there's no tutorial to get you up to speed, so loading some test
		  		data is a good way to familiarize yourself with the app.
		  	</p>

		  	<div>
		  		<Button
		  		kind="solid"
		  		color="red"
		  		label="Load Demo Data" 
		  		onClick={this.addDemoData}
					busy={this.$get('demoDataStatus')===0} />
		  	</div>

		  	<div className="FirstRun-hints-hint">
		  		Whenever you want to start working with your own data, click the <i className="fa fa-arrow-down" /> icon
		  		to start a clean slate.
		  	</div>

		  </div>
		  <ButtonPanel className="FirstRun-bubble-buttonPanel">
			  <Button 
		  	className="FirstRun-bubble-button-primary" 
		  	iconClass="fa fa-chevron-right" 
		  	kind="text" 
		  	align="right" 
		  	label="Gimme a clean slate"
		  	busy={this.$get('demoDataStatus')!==undefined}
		  	onClick={()=>{ 
		  		this.nextStep();
		  	}} />
		  </ButtonPanel>
		</div>
		</div>);		
	}

,	offyougo(){

		return (
		<div className="FirstRun-step" key="offyougo">
		<div className="FirstRun-bubble FirstRun-hints">
			<div className="FirstRun-bubble-content">
		  	<h1 className="FirstRun-bubble-Title">You're good to go...</h1>
		  	<p className="primary">
		  		Ok. We're all set up! Use the feedback button in the bottom right to let me
		  		me know your great ideas or any problems you run into...
		  	</p>

		  	<p>
		  		Have fun! 
		  	</p>

		  </div>
		  <ButtonPanel className="FirstRun-bubble-buttonPanel">
			  <Button 
		  	className="FirstRun-bubble-button-primary" 
		  	iconClass="fa fa-chevron-right" 
		  	kind="text" 
		  	align="right" 
		  	label="Done"
		  	onClick={()=>{ 
		  		this.finish();
		  	}} />
		  </ButtonPanel>
		</div>
		</div>);		
	}


});


export default FirstRun;