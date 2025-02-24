# Multiplication is Not What You Need

_Kai Breese · Justin Chou · Katelyn Abille · Lukas Fullner_

![](/hardware-accelerators-site/chip.svg)

## Introduction

As modern artificial intelligence (AI) systems grow in scale and complexity, their computational processes require increasingly large amounts of energy. Notably, ChatGPT required an estimated 564 MWh per day as of February 2023. In comparison, the cost of two days nearly amounts to the total 1,287 MWh used throughout the training phase, highlighting that inference is a major long-term cost.

The central operation behind AI operations today is floating-point (fp) multiplication — any advancements in efficiency for this algorithm would increase efficiency across the board in the AI world. We recently found a paper by Luo and Sun outlining a classic speed-for-accuracy trade-off that does fp multiplication in linear time rather than quadratic (O(n^2)). In other words, it promises high efficiency gains while claiming the loss in accuracy is minimal enough not to affect outputs.

Our project implements both the industry standard IEEE-754 algorithm and lmul algorithm in hardware. Specifically, we've trained a classification model (MNIST) and will be running it through both hardware simulators to validate the paper's claims and measure the energy savings.

## Methods: Building an Efficient AI Hardware Accelerator

### The Core Innovation: L-Mul Algorithm

Traditional neural networks rely heavily on floating-point multiplication, which is computationally expensive and energy-intensive. Our key innovation is implementing the L-Mul algorithm (by Luo and Sun), which approximates floating-point multiplication using primarily addition operations. This significantly reduces computational complexity while maintaining accuracy.

The algorithm works by:

1. Taking two floating-point numbers
2. Breaking them into their sign, exponent, and mantissa components
3. Using a clever mathematical approximation to replace the expensive mantissa multiplication with a simpler addition operation
4. Recombining the components to produce the final result

This approach maintains high precision while requiring fewer computational resources than traditional floating-point multiplication.

### Hardware Architecture: The Systolic Array

At the heart of our accelerator is a systolic array - a grid of processing elements (PEs) that efficiently perform matrix multiplication, which is crucial for neural network operations.

![Systolic Array Architecture](/hardware-accelerators-site/images/design-flow.png)

The systolic array works like an assembly line:

- Input data flows in from the top and left
- Each PE multiplies its inputs (using our L-Mul algorithm) and adds to its running sum
- Results flow downward and rightward to neighboring PEs
- The final results accumulate at the bottom

This design allows for:

- Parallel processing
- Efficient data reuse
- Reduced memory bandwidth requirements
- Scalable performance

### Processing Element Design

Each processing element (PE) in our systolic array is carefully designed to optimize the L-Mul algorithm implementation.

![Processing Element Architecture](/hardware-accelerators-site/images/pe.png)

Key components include:

- Input/weight registers for data storage
- Control logic for timing and data flow
- The L-Mul multiplication unit
- An accumulator for running sums
- Pipeline registers for efficient operation

### Software Integration

To make our hardware practical for real-world use, we developed:

1. A compiler that converts standard neural network models (in ONNX format) to instructions our hardware can execute
2. A simulation framework to test and validate performance
3. Testing tools to measure accuracy, speed, and energy efficiency

This infrastructure allows AI developers to easily run their models on our accelerator without needing to understand the underlying hardware details.

Our implementation uses PyRTL (Python Register Transfer Level) for hardware description, making it easier to prototype and test different design configurations while maintaining the option to later convert to actual hardware through Verilog generation.

## Results & Conclusion

[still in progress]
