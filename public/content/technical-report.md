# Multiplication is Not What You Need: Designing an Energy-Efficient Hardware Accelerator for Deep Learning

_Kai Breese · Justin Chou · Katelyn Abille · Lukas Fullner_

![One of our hardware components](/hardware-accelerators-site/images/adder_pipelined.png)

## Introduction

As modern artificial intelligence (AI) systems grow in scale and complexity, their computational processes require increasingly large amounts of energy. Notably, ChatGPT required an estimated 564 MWh per day as of February 2023. In comparison, the cost of two days nearly amounts to the total 1,287 MWh used throughout the training phase, highlighting that inference is a major long-term cost.

The central operation behind AI operations today is floating-point (fp) multiplication — any advancements in efficiency for this algorithm would increase efficiency across the board in the AI world. We recently found a paper by Luo and Sun outlining a classic speed-for-accuracy trade-off that does fp multiplication in linear time rather than quadratic (O(n^2)). In other words, it promises high efficiency gains while claiming the loss in accuracy is minimal enough not to affect outputs.

Our project implements both the industry standard IEEE-754 algorithm and L-Mul algorithm in hardware. Specifically, we've trained a classification model (MNIST) and will be running it through both hardware simulators to validate the paper's claims and measure the energy savings.

## Background

### Floating-Point Numbers

The IEEE-754 standard defines the representation and behaviors of floating-point numbers in most systems. A floating-point number at its core is represented in three sections of bits: the single sign bit, followed by the exponent bits and mantissa bits (also known as the significand). The most significant bit (MSB) is always the sign bit, determining is the number is positive or negative. The exponent scales the number by a power of two, and lastly the least significant bits (LSB), representing the mantissa, provide the fractional part of the number.

Most modern machine learning models use FP32 (32-bit) or mixed-precision formats like BF16 (16-bit) to represent parameters and activations. As a result, the speed of these models relies heavily on the speed at which we can conduct these floating-point operations. Our work aims to use the L-Mul algorithm to speed it up.

### The Floating-Point Multiplication Challenge

Traditional floating-point multiplication is computationally expensive. To multiply two floating-point numbers, the sign bits are XORed, the exponents are added, the mantissas are multiplied (the most expensive step), and the result is normalized and rounded. Altogether, the algorithm is relatively computationally expensive at a complexity of O(n^2). In large neural networks with billions of parameters, these costs accumulate rapidly.

p = (s₁ ⊕ s₂) × 2^(e₁+e₂-2b) × (1+m₁+m₂+m₁×m₂)

## Methods: Building an Efficient AI Hardware Accelerator

Our goal with this project was to validate L-Mul's efficiency and speed upgrades over the standard IEEE algorithm in hardware, while also ensuring its loss in precision doesn't have an outsized impact on the result.

### The Core Innovation: L-Mul Algorithm

The linear-complexity multiplication (L-Mul) algorithm, proposed by Luo and Sun, is the foundation of our accelerator. Traditional floating-point multiplication scales quadratically with bit width, while L-Mul scales linearly, offering significant efficiency gains.

The key insight of L-Mul is that the most expensive operation, mantissa multiplication, can be approximated using a term L(M). The L function is defined as:

L(M) = {
M, if M ≤ 3
3, if M = 4
4, if M > 4
},

where M is the number of mantissa bits.

The multiplication algorithm then becomes:

(s₁ ⊕ s₂) × 2^(e₁+e₂-b) × (1+m₁+m₂+2^(-L(M)))

This elegant simplification eliminates the need for costly multiplication units, significantly reducing power consumption and silicon area while preserving the numerical properties needed for neural network computations.

### Hardware Architecture

#### High Level Architecture

We are designing and optimizing on three levels to create an efficient and performant accelerator. First is the register transfer level; this is the lowest level hardware design of basic components like adders, multipliers, multiplexers, and instruction decoders. The key implementation here is the L-Mul unit for approximating floating-point multiplication.

The design combines low-level components into higher-level abstractions—configurable systolic arrays, accumulator memory buffers, and vectorized activation function modules—implemented as flexible class "containers" that serve as hardware placeholders until simulation time. This approach enables dynamic control over data flow patterns, timing signals, and hardware/software boundaries. The resulting accelerator architecture draws inspiration from Google TPU, featuring minimal control logic, a large matrix engine with attached accumulators and memory, and a connected activation function module. This configuration, combined with DiP data flow, creates a FIFO-free design that reduces latency and power consumption.

#### Systolic Array Implementation

![Systolic Array Architecture](/hardware-accelerators-site/images/design-flow.png)

At the heart of our accelerator is a systolic array - a grid of processing elements (PEs) that efficiently perform matrix multiplication, which is crucial for neural network operations.

Our implementation uses the DiP (Diagonal-Input and Permutated weight-stationary) dataflow pattern, which optimizes for both energy efficiency and computational density. The array works like an assembly line, inputting data flows in from the top and left, using each PE to perform multiply-accumulate operations, having the results flow downward and rightward, and accumulating final results in the bottom and right edges.

This architecture enables parallel processing, efficient data reuse, and reduced memory access, addressing key performance bottlenecks in AI computation.

#### Processing Element Design

![Processing Element Architecture](/hardware-accelerators-site/images/pe.png)

The core element of the systolic array is the processing element. The PE utilizes a floating-point MAC unit and supports mixed precision weights, activations, and accumulation formats. FP8, Bfloat16, half-precision, and full-precision formats are supported for all components that make up a PE. Operands are upcast to the larger bitwidth of the two before the operation (multiply or add) is performed. Each PE contains 3 or 4 registers depending on the level of pipelining specified. Weight register, data register, and accumulation register are the minimum requirement, and optionally a product register can be included to reduce the critical path distance from inputs to outputs, increasing the maximum frequency of the design. We leave the pipelining level configurable to explore the design space and tradeoffs between performance and efficiency. PEs also contain control signal inputs, but no control out wires meaning that control signals must be continuously sent from an external source and do not propagate between the PEs like the data. The figure above shows a block diagram of the processing element design.

#### Activation Unit and Accumulators

To support complete neural network inference, we implemented activation function such as RELU, accumulator buffers for storing partial results during tiled matrix operations, and control logic for coordinating computation across the array.

Our VLIW (Very Long Instruction Word) approach simplifies hardware control logic by moving complexity to the compiler, further reducing energy consumption and silicon area. This helped us exploit instruction-level parallelism to optimize our accelerator.

### Software Integration

#### PyRTL Development Environment

All of our major hardware implementations for this project (standard floating-point multiplier, L-Mul multiplier, floating-point adder, systolic array and its processing elements, and the accumulator buffers for tiled matrix operations) were done in PyRTL (Mirza). This approach proved to be most viable for us because it allowed us to utilize Pythonic syntax for our hardware description. The framework is rich with built-in features that smoothened out our development process. We relied heavily on immediate representation throughout our pipeline building process due to its ability to simulate and optimize our work. It also allowed us to work in our comfort language as we built out our utility libraries, testing suite, visualizations, and miscellaneous logic control in a language we're comfortable with (Clow).

We developed a comprehensive stack to validate our hardware design. The first element of that was custom data types, which we used for accurate simulation of the different floating-point formats. We also accelerated simulations through C code generation, which was automatic through PyRTL. Finally, we had a full pytest framework for validating the outputs of our functions.

### ASIC Design Flow

To evaluate real-world performance metrics, we synthesized our design to physical gates. Unfortunately, this emerged as one of the major challenges for this project due to the closed-source nature of hardware design libraries. For a full RTL to Graphic Data System (GDS) flow, we used OpenROAD with FreePDK45, an open-source process design kit. OpenROAD utilizes Yosys to synthesize our RTL code to gate-level netlists before doing placement, routing, and physical design. It also provides statistics on the hardened designs, which we used for our power, area, and delay analysis. Finally, we used SiliconCompiler, a Python API for taking designs from concept to production, for certain visualizations.

This process allowed us to obtain accurate measurements of area, power, and timing for both L-Mul and IEEE-754 implementations across multiple floating-point formats.

## Results & Discussion

![Area, Power, and Delay metrics across all dtypes](/hardware-accelerators-site/images/chart.png)

### Hardware Efficiency Metrics

Our hardware implementations were all measured on 45nm technology. As shown in the table below, the L-Mul algorithm demonstrated substantial improvements over the standard IEEE-754 multiplier across all key speed/efficiency metrics:

# Floating Point Design Performance Metrics

| Design               |  **fp8** |           |           | **bf16** |           |           | **fp32** |           |           |
| -------------------- | -------: | --------: | --------: | -------: | --------: | --------: | -------: | --------: | --------: |
|                      | **Area** | **Power** | **Delay** | **Area** | **Power** | **Delay** | **Area** | **Power** | **Delay** |
| L-Mul Comb.          |  112.784 |   0.11116 |      0.36 |  255.626 |  0.252634 |      0.48 |  702.506 |  0.531981 |      0.55 |
| L-Mul Pipelined      |  348.726 |  0.582629 |      0.51 |  688.674 |  0.928291 |       0.6 |  1529.23 |   1.30025 |      0.67 |
| Multiplier Comb.     |  347.396 |   1.05533 |      1.29 |  1067.72 |   7.46015 |      1.94 |  6311.91 |   133.398 |      2.85 |
| Multiplier Pipelined |  487.578 |  0.761612 |      0.72 |   1169.6 |   1.65408 |      1.05 |  6457.42 |   9.31073 |      1.62 |
| Multiplier Stage 2   |   162.26 |  0.161324 |      0.55 |  552.482 |   1.18352 |      0.91 |   4149.6 |   29.2743 |      1.46 |
| Multiplier Stage 3   |    71.82 | 0.0272315 |      0.23 |  134.064 | 0.0484747 |      0.29 |  319.466 | 0.0804445 |      0.42 |
| Multiplier Stage 4   |  160.132 |  0.118213 |      0.65 |  352.982 |  0.216456 |      0.69 |  1253.66 |  0.553272 |      1.07 |

\*Note: Area is likely measured in μm², Power in mW, and Delay in ns, based on the commented LaTeX in the original fil

Looking at the combinational implementations, the benefits become even more pronounced at higher precisions. For FP8, L-Mul achieves a 67.5% reduction in area, 89.5% reduction in power, and 72.1% reduction in delay compared to the standard multiplier. Moving to BF16, these improvements increase to 76.1% reduction in area, 96.6% reduction in power, and 75.3% reduction in delay. At FP32, the highest precision we tested, L-Mul demonstrates its most dramatic advantages: 88.9% reduction in area, 99.6% reduction in power, and 80.7% reduction in delay.

The pipelined implementations follow similar trends, with the L-Mul pipelined design consistently outperforming the standard pipelined multiplier across all metrics and data types. This scaling behavior confirms our hypothesis that the L-Mul approach maintains its linear complexity advantage as precision increases, while traditional multiplication's quadratic scaling becomes increasingly costly.

These results make sense given the context that the L-Mul approach scales linearly with bit width, while traditional multiplication scales quadratically.

### Model Accuracy

To evaluate the loss in precision over the course of an entire model, we trained a multilayer perceptron (MLP) on the MNIST dataset and tested it using both multiplier implementations. The results are shown below:

| Multiplier | Weight Type | Activation Type | Accuracy (%) |
| ---------- | ----------- | --------------- | ------------ |
| Baseline   | Float32     | Float32         | 97.81        |
| Baseline   | Float8      | BF16            | 97.43        |
| Baseline   | BF16        | BF16            | 97.46        |
| L-Mul      | Float8      | BF16            | 96.89        |
| L-Mul      | BF16        | BF16            | 97.37        |

When using BF16 for both weights and activations, the L-Mul implementation achieves 97.37% accuracy, only 0.09 percentage points lower than the baseline with identical data types (97.46%). This remarkably small difference would be imperceptible in most real-world applications. When using the more aggressive Float8 format for weights with BF16 activations, we observed a slightly larger accuracy gap of 0.54 percentage points (96.89% vs 97.43%). Even in this more challenging scenario, the L-Mul implementation maintains strong performance, with both approaches showing only modest reductions from the full-precision Float32 baseline (97.81%).

These numbers tell a compelling story: the approximation introduced by L-Mul preserves the essential numerical properties needed for neural network inference while enabling dramatic hardware efficiency improvements.

### Significance of Findings

Our work demonstrates that the L-Mul algorithm offers a reasonable trade-off between hardware efficiency and model accuracy. The substantial reductions in area, power, and delay come at a negligible cost to model performance for most applications.

These improvements have far-reaching implications for AI deployment across the computing spectrum. For edge devices like smartphones, wearables, and IoT sensors, L-Mul could enable more capable AI on resource-constrained hardware, extending battery life while maintaining functionality. In data centers, where power consumption for AI inference is becoming an increasingly significant operational cost and environmental concern, the near 99% power reduction for high-precision operations could translate to massive energy savings at scale.

Perhaps most importantly, the consistent scaling advantage across different precision formats indicates that L-Mul will become even more beneficial as models grow in size and complexity. As AI systems continue to expand in both scale and scope, techniques like L-Mul that fundamentally reimagine core computational operations will be essential for sustainable advancement.

## Conclusion and Future Work

Our implementation of the L-Mul algorithm in a hardware accelerator for deep learning validates the claims made by Luo and Sun. We've demonstrated that replacing traditional floating-point multiplication with this approximation method yields substantial hardware efficiency gains with minimal impact on model accuracy.

In summary, the hardware accelerator we've developed offers:

- Up to 99.6% reduction in power consumption

- Up to 88.9% reduction in silicon area

- Up to 80.7% reduction in computational delay

- Less than 0.6 percentage point accuracy loss on MNIST classification

Though we don't expect L-Mul to find its way all over the AI landscape, we do think that this paper validates an important paradigm: a fundamental reconsideration of computing primitives can offer
another path towards hardware acceleration.

### Future Directions

If we were to continue working on this, we had a few ideas for how we could take this further. First and foremost was the idea of heterogeneous processing elements. We could merge L-Mul and IEEE multipliers into the same architecture, where more critical parts of the network use IEEE, while less sensitive portions use the L-Mul unit.

The most obvious next step, however, was that we wanted to look at extending the accelerator to support more complex (and widely used) architectures such as the transformer. We trained an MLP on MNIST as a proof-of-concept (and a result of time constraints), but we could build out certain functions to accomodate a model like BERT --- essentially, we could validate the algorithm in a generative use case.

On a similar note, while our ASIC simulation is useful as a proof-of-concept, implementing the design on FPGA would offer stronger validation of our performance characteristics, and would get us one step closer to direct measuement of inference latency on a realistic workload. This is, however, much more resource intensive.

## References

1. Luo, H., & Sun, W. (2024). Addition is All You Need: A Novel Perspective on Accelerating Deep Learning

2. Chen, X., et al. (2024). Power-Efficient Hardware Implementation of L-Mul on FPGAs

3. Zhou, K., et al. (2021). Rethinking Neural Architecture and Hardware Co-Design

4. De Vries, A. (2023). The Growing Energy Demand of AI

5. Micikevicius, P., et al. (2022). FP8 Formats for Deep Learning
