/**
 * # Game stages definition file
 * Copyright(c) 2018 Stefano Balietti
 * MIT Licensed
 *
 * Stages are defined using the stager API
 *
 * http://www.nodegame.org
 * ---
 */

module.exports = function(stager, settings) {

    stager
        .next('instructions')
        .next('quiz')
        .next('questionnaire1')
        
        .repeat('game', settings.REPEAT)
        .step('bid')
        .step('results')

        .next('questionnaire2')
        .next('end')      

        .gameover();

    // Modify the stager to skip some stages.

    //stager.skip('instructions');
    //stager.skip('quiz');

    // stager.skip('game');
    // stager.skip('questionnaire');

};
