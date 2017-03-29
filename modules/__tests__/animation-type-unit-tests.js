import expect from 'expect'
import animateScroll from '../mixins/animate-scroll';
import smooth from '../mixins/smooth';


describe('AnimationTypeUnitTests', () => {

  it('chooses correct easing function with no smooth options', () => {
    var animation = animateScroll.getAnimationType({})
    expect(animation).toEqual(smooth.defaultEasing);
  });

  it('chooses correct easing function for smooth: true', () => {
    var animation = animateScroll.getAnimationType({ smooth: true })
    expect(animation).toEqual(smooth.defaultEasing);
  });

  it('chooses correct easing function for smooth: false', () => {
    var animation = animateScroll.getAnimationType({ smooth: false })
    expect(animation).toEqual(smooth.defaultEasing);
  });

  it('chooses correct easing function for smooth: easeInOutQuint', () => {
    var animation = animateScroll.getAnimationType({ smooth: 'easeInOutQuint' })
    expect(animation).toEqual(smooth.easeInOutQuint);
  });

  it('chooses correct easing function incorrect smooth input', () => {
    var animation = animateScroll.getAnimationType({ smooth: 'InOutQuint' })
    expect(animation).toEqual(smooth.defaultEasing);
  });

  it('chooses correct easing function incorrect smooth input2', () => {
    var animation = animateScroll.getAnimationType({ smooth: 4 })
    expect(animation).toEqual(smooth.defaultEasing);
  });

  it('chooses correct easing function incorrect smooth input3', () => {
    var animation = animateScroll.getAnimationType({ smooth: '' })
    expect(animation).toEqual(smooth.defaultEasing);
  });

  it('chooses correct easing function incorrect smooth input4', () => {
    var animation = animateScroll.getAnimationType({ smooth: null })
    expect(animation).toEqual(smooth.defaultEasing);
  });

  it('chooses correct easing function incorrect smooth input5', () => {
    var animation = animateScroll.getAnimationType({ smooth: undefined })
    expect(animation).toEqual(smooth.defaultEasing);
  });

  it('chooses correct easing function incorrect smooth input6', () => {
    var animation = animateScroll.getAnimationType({ smooth: { smooth: true } })
    expect(animation).toEqual(smooth.defaultEasing);
  });

});
