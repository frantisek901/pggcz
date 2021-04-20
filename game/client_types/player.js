/**
/**
* # Player code for Social Mobility Game
* Copyright(c) 2020 Stefano Balietti
* MIT Licensed
*
* http://www.nodegame.org
* ---
*/

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    stager.setOnInit(function() {
        var header;

        console.log('INIT PLAYER! *******************************************');

        node.game.oldContrib = null;
        node.game.oldPayoff = null;

        // Setup page: header + frame.
        header = W.generateHeader();
        W.generateFrame();

        // Add widgets.
        this.visualRound = node.widgets.append('VisualRound', header);
        this.visualTimer = node.widgets.append('VisualTimer', header);
        this.doneButton = node.widgets.append('DoneButton', header);


        // This function is called to create the bars.
        this.showBars = function(contribs) {
            var player, i, div, subdiv, color;
            var barsDiv;
            var text
            var bars;

            console.log(contribs);

            barsDiv = W.getElementById('barsResults');
            barsDiv.innerHTML = '';

            bars = W.getFrameWindow().bars;

            for (i = 0; i < contribs.length; i++) {
                div = document.createElement('div');
                // div.classList.add('groupContainer');
                // groupHeader = document.createElement('h4');
                // groupHeaderText = 'Group ' + groupNames[i];

                // groupHeader.innerHTML = groupHeaderText;
                barsDiv.appendChild(div);
                // div.appendChild(groupHeader);

                player = contribs[i].player;

                // It is me?
                if (player === node.player.id) {
                    color = '';
                    text = ' <img src="imgs/arrow.jpg" ' +
                    'style="height:15px;"/> Tvůj příspěvek';
                }
                else {
                    color = '#9932CC';
                    text = '';
                }

                // This is the DIV actually containing the bar
                subdiv = document.createElement('div');
                div.appendChild(subdiv);
                bars.createBar(subdiv, contribs[i].contribution,
                    (1.3 * node.game.settings.COINS), color, text);

            }
        };

        this.displaySummaryPrevRound = function() {
            var save, groupReturn;
            // Shows previous round if round number is not 1.
            if ('number' !== typeof node.game.oldContrib) return;
            save = node.game.settings.COINS - node.game.oldContrib;
            groupReturn = node.game.oldPayoff - save;

            W.show('previous-round-info');
            // Updates display for current round.
            W.setInnerHTML('yourPB', save);
            W.setInnerHTML('yourOldContrib', node.game.oldContrib);
            W.setInnerHTML('yourReturn', groupReturn);
            W.setInnerHTML('yourPayoff', node.game.oldPayoff);
        };
    });


    // STAGES and STEPS.

    stager.extendStep('instructions', {
        frame: 'instructions.htm'
    });


    stager.extendStep('quiz', { 
        widget: {
            name: 'ChoiceManager',
            options: {
                id: 'quiz',
                title: false,
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'coinsEveryRound',
                        choices: ['20', '40', '10', '30'],
                        correctChoice: 0, // Bacha! Je to cislovane 0, 1, 2, 3! ...
                        shuffleChoices: true,
                        mainText: 'Kolik HK dostanete v každém kole hry?',
                        //
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'coinsMaxi',
                        choices: ['40', '20', '10', '30'],
                        correctChoice: 0, // Bacha! Je to cislovane 0, 1, 2, 3! ...
                        shuffleChoices: true,
                        mainText: 'Kolik HK můžete získat maximálně v jednom kole, pokud investujete do <u><i>společného účtu</u></i> 20 HK?',
                        //
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'coinsMini',
                        choices: ['10', '20', '40', '30'],
                        correctChoice: 0, // Bacha! Je to cislovane 0, 1, 2, 3! ...
                        shuffleChoices: true,
                        mainText: 'Kolik HK získáte v kole, kde jen Vy investujete do <u><i>společného účtu</u></i> 20 HK a ostatní nic neinvestují?',
                        //
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'coinsOthers',
                        choices: ['30', '20', '40', '10'],
                        correctChoice: 0, // Bacha! Je to cislovane 0, 1, 2, 3! ...
                        shuffleChoices: true,
                        mainText: 'Kolik HK získají <i><u>ostatní</u></i> v kole, kde jen Vy investujete do <u><i>společného účtu</u></i> 20 HK a ostatní nic neinvestují?',
                        //
                   },
                   {
                        name: 'ChoiceTable',
                        id: 'lowestPayment1',
                        choices: ['15', '10', '20', '35'],
                        correctChoice: 0,
                        shuffleChoices: true,
                        mainText: 'V kole všechny své HK uložíte rovnou na <u><i>osobní účet</u></i> a do <u><i>společného účtu</u></i> nic neinvestujete. Vaši spoluhráči investovali do <u><i>společného účtu</u></i> po 10 HK každý. <u>Kolik HK získáte ze <i>společného účtu</i></u>?',
                        //
                    },
                  {
                        name: 'ChoiceTable',
                        id: 'lowestPayment2',
                        choices: ['35', '10', '20', '15'],
                        correctChoice: 0,
                        shuffleChoices: true,
                        mainText: 'V kole všechny své HK uložíte rovnou na <u><i>osobní účet</u></i> a do <u><i>společného účtu</u></i> nic neinvestujete. Vaši spoluhráči investovali do <u><i>společného účtu</u></i> po 10 HK každý. <u>Kolik HK získáte za celé kolo</u>?',
                        //
                    },
  
//V kole jste si nechal všechny své mince, ale Vaši spoluhráči dali do společného banku po 10 mincí každý. Kolik mincí získáte z banku (A)? Kolik mincí budete mít na konci kola (B)?
//Odpověď A: 20, 15, 30, 35, 40
//Odpověď B: 20, 15, 30, 35, 40

  
                  ]
            }
        }

    });

    stager.extendStep('bid', {
        frame: 'bidder.htm',
        cb: function() {

            W.setInnerHTML('bid_contrib', node.game.settings.COINS);

            // Show summary previous round.
            node.game.displaySummaryPrevRound();
            node.game.bidInput = node.widgets.append('CustomInput', "input-td", {
                type: 'int',
                min: 0,
                max: node.game.settings.COINS,
                requiredChoice: true
            });


        },
        timeup: function() {
            var contribution = node.game.oldContrib;
            if ('undefined' === typeof contribution) {
                contribution = J.randomInt(1, node.game.settings.COINS);
            }
            node.game.bidInput.setValues({
                // Random value if undefined.
                values: contribution
            });
            node.done();
        },
        done: function() {
            var bid = node.game.bidInput.getValues();
            if (!bid.isCorrect && !node.game.timer.isTimeup()) return false;
            // Store reference for next round.
            node.game.oldContrib = bid.value;
            // Send it to server.
            return { contribution: bid.value };
        }
    });

    stager.extendStep('results', {
        frame: 'results.htm',
        cb: function () {
            node.on.data('results', function(msg) {
                var payoff, s;
                s = node.game.settings;

                payoff = msg.data.payoff;
                node.game.oldPayoff = payoff;

                // How many coins player put in personal account.
                var save = s.COINS - node.game.oldContrib;
                var payoffSpan = W.gid('payoff');
                    payoffSpan.innerHTML = save + ' + ' + (payoff - save) +
                    ' = ' + node.game.oldPayoff;

                // Show bars if required.
                if (s.showBars) this.showBars(msg.data.contribs);
            });
        }
    });

    stager.extendStep('questionnaire1', {
        widget: {
            name: 'ChoiceManager',
            root: 'container',
            options: {
                className: 'centered',
                id: 'questionnaire',
                title: false,
                forms:  [
                    {
                        name: 'ChoiceTable',
                        id: 'znajiSe',
                        choices: [ '1-vůbec', '2', '3', '4', '5', '6', '7-velmi dobře' ],
                        requiredChoice: true,
                        title: false,
                        mainText: 'Jak dobře se znáte se spoluhráči v tomto experimentu? Vyberte na škále od 1 do 7, přičemž 1 znamená vůbec a 7 velmi dobře.'
                    },

                    {
                        name: 'ChoiceTable',
                        id: 'blizkost',
                        choices: [ '1-vůbec', '2', '3', '4', '5', '6', '7-velmi blízký' ],
                        requiredChoice: true,
                        title: false,
                        mainText: 'Jak moc jste si se svými spoluhráči blízký? Vyberte na škále od 1 do 7, přičemž 1 znamená vůbec a 7 velmi blízký.'
                    },

                    {
                        name: 'ChoiceTable',
                        id: 'kooperujeKam',
                        choices: [ '1-vůbec nespolupracuji', '2', '3', '4', '5', '6', '7-velmi spolupracuji' ],
                        requiredChoice: true,
                        title: false,
                        mainText: 'Myslíte si, že jste typ kamaráda, který spolupracuje se svými blízkými přáteli? Vyberte na škále od 1 do 7, přičemž 1 znamená vůbec s nimi nespolupracuji a 7 velmi s nimi spolupracuji.'
                    },

                    {
                        name: 'ChoiceTable',
                        id: 'kooperujeCiz',
                        choices: [ '1-vůbec nespolupracuji', '2', '3', '4', '5', '6', '7-velmi spolupracuji' ],
                        requiredChoice: true,
                        title: false,
                        mainText: 'Myslíte si, že jste osoba, která spolupracuje s ostatními? Vyberte na škále od 1 do 7, přičemž 1 znamená vůbec s nimi nespolupracuji a 7 velmi s nimi spolupracuji.'
                    },
                ],
                freeText: 'Please leave any feedback for the experimenter'
            }
        }
    });

    stager.extendStep('questionnaire2', {
        widget: {
            name: 'ChoiceManager',
            root: 'container',
            options: {
                className: 'centered',
                id: 'questionnaire',
                title: false,
                forms:  [
                    {
                        name: 'ChoiceTable',
                        id: 'communication',
                        choices: [ 'Ano', 'Ne', 'Nechci uvést' ],
                        requiredChoice: true,
                        title: false,
                        mainText: 'Mluvili jste se spoluhráči během hry, nebo jste se spojili jiným způsobem?'
                    },

                    {
                        name: 'ChoiceTable',
                        id: 'agreement',
                        choices: [ 'Ano', 'Ne', 'Nechci uvést' ],
                        requiredChoice: true,
                        title: false,
                        mainText: 'Domluvili jste si se spoluhráči před hrou nějakou společnou taktiku nebo strategii?'
                    },

                    {
                        name: 'ChoiceTable',
                        id: 'real1',
                        choices: [ 'Ano', 'Napůl', 'Ne', 'Neměli jsme nic domluveno', 'Nechci uvést' ],
                        requiredChoice: true,
                        title: false,
                        mainText: 'Pokud jste si se spoluhráči domluvili před hrou nějakou společnou taktiku nebo strategii, držel/a jste se jí Vy osobně?'
                    },

                    {
                        name: 'ChoiceTable',
                        id: 'real2',
                        choices: [ 'Ano', 'Napůl', 'Ne', 'Neměli jsme nic domluveno', 'Nechci uvést' ],
                        requiredChoice: true,
                        title: false,
                        mainText: 'Pokud jste si se spoluhráči domluvili před hrou nějakou společnou taktiku nebo strategii, drželi se jí Vaši spoluhráči?'
                    },

                    {
                        name: 'ChoiceTable',
                        id: 'strategy',
                        choices: [
                            [ 'random', 'Náhodně vybírat částky' ],
                            [ 'egoist', 'Maximalizovat můj vlastní výnos' ],
                            [ 'group', 'Maximalizovat výnos skupiny' ],
                            [ 'inequality aversion', 'Minimilizovat rozdíly mezi mým výnosem a výnosem spoluhráčů'],
                            [ 'other', 'Jiná (prosím, popište níže)' ]
                        ],
                        title: false,
                        orientation: 'v',
                        requiredChoice: true,
                        mainText: 'Zkuste popsat svou strategii:'
                    },
                ],
                freeText: 'Prosím, zanechte nám jakoukoli zpětnou vazbu k experimentu:'
            }
        }
    });
    
    
    stager.extendStep('end', {
        init: function() {
            node.game.doneButton.destroy();
            node.game.visualTimer.destroy();
        },
        //frame: 'end.htm'
        widget: {
            name: 'EndScreen',
            options: {
				headerMessage: 'Děkujeme za účast!',
				message: 'Váš individuální výsledek je níže. O tom, jak dopadla Vaše skupina a Vy osobně Vás budeme informovat e-mailem, pokud nám jej zanecháte.', 
				totalWinCurrency: 'HK (Herních korun)',
				showExitCode: false,
				showFeedbackForm: true,
                title: 'Váš individuální výsledek je níže. O tom, jak dopadla Vaše skupina a Vy osobně Vás budeme informovat e-mailem, pokud nám jej zanecháte.',
                email: {
                   texts: {
                       label: 'Pokud chcete být informován o výsledcích turnaje a výši Vaší výhry, zanechte nám prosím svůj e-mail:'
                   }
               }
           }
        }
    });
};
