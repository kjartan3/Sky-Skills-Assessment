const NavigationButtons = ({ onPrevious, onNext, isFirstPage, isLastPage, canProceed}) => {
    return (
    <div className="button-container">
        <button onClick={onPrevious} disabled={isFirstPage}>
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
        >
          {isLastPage ? "Submit" : "Next"}
        </button>
      </div>
    )
}

export default NavigationButtons;