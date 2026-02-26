import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Zap, IndianRupee, TrendingUp, Leaf, Info, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { useData } from '../contexts/DataContext';
import Header from '../sections/public/Header';
import Footer from '../sections/public/Footer';
import type { CalculatorResults } from '../types';

export default function CalculatorPage() {
  const { settings, fetchSettings } = useData();
  const [useKwh, setUseKwh] = useState(false);
  const [monthlyBill, setMonthlyBill] = useState<string>('');
  const [monthlyKwh, setMonthlyKwh] = useState<string>('');
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [results, setResults] = useState<CalculatorResults | null>(null);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const calculateSavings = () => {
    if (!settings) return;

    const inputValue = useKwh
      ? parseFloat(monthlyKwh) || 0
      : parseFloat(monthlyBill) || 0;

    if (inputValue <= 0) return;

    // Calculate current monthly kWh usage
    const currentMonthlyKwh = useKwh
      ? inputValue
      : inputValue / settings.tariff_per_kwh;

    // Calculate current monthly cost
    const currentMonthlyCost = useKwh
      ? inputValue * settings.tariff_per_kwh
      : inputValue;

    // Recommended system size (kW) - covers 100% of usage
    const recommendedSystemSize = Math.ceil(
      currentMonthlyKwh / settings.kwh_per_kw_per_month
    );

    // System cost
    const systemCost = recommendedSystemSize * settings.system_cost_per_kw;

    // Subsidy amount
    const subsidyAmount = systemCost * (settings.subsidy_percentage / 100);

    // Net cost after subsidy
    const netCost = systemCost - subsidyAmount;

    // Monthly generation
    const monthlyGeneration = recommendedSystemSize * settings.kwh_per_kw_per_month;

    // Monthly savings (what you would have paid for that electricity)
    const monthlySavings = monthlyGeneration * settings.tariff_per_kwh;

    // Yearly savings
    const yearlySavings = monthlySavings * 12;

    // Savings percentage
    const savingsPercentage = (monthlySavings / currentMonthlyCost) * 100;

    // Payback period in years
    const paybackPeriod = netCost / yearlySavings;

    // 25-year savings (typical solar panel lifespan)
    const maintenanceCostTotal =
      recommendedSystemSize * settings.maintenance_cost_per_kw_year * 25;
    const twentyFiveYearSavings = yearlySavings * 25 - netCost - maintenanceCostTotal;

    // CO2 reduction (approx 0.85 kg per kWh in India)
    const co2Reduction = monthlyGeneration * 12 * 25 * 0.85; // kg over 25 years

    setResults({
      currentMonthlyCost,
      recommendedSystemSize,
      systemCost,
      subsidyAmount,
      netCost,
      monthlyGeneration,
      monthlySavings,
      yearlySavings,
      savingsPercentage: Math.min(savingsPercentage, 100),
      paybackPeriod,
      twentyFiveYearSavings,
      co2Reduction,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, decimals = 0) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: decimals,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c4ff00]/10 border border-[#c4ff00]/30 mb-6">
              <Calculator className="w-4 h-4 text-[#c4ff00]" />
              <span className="text-sm text-[#c4ff00] font-medium">Solar Savings Calculator</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Calculate Your Solar Savings
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover how much you can save by switching to solar energy. 
              Enter your current electricity usage to get a personalized estimate.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Input Section */}
            <div className="bg-[#1a1a1a] rounded-3xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">Enter Your Details</h2>

              {/* Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 mb-6">
                <div className="flex items-center gap-3">
                  <IndianRupee className="w-5 h-5 text-[#c4ff00]" />
                  <span className={`text-sm ${!useKwh ? 'text-white' : 'text-gray-500'}`}>
                    Monthly Bill (₹)
                  </span>
                </div>
                <Switch
                  checked={useKwh}
                  onCheckedChange={setUseKwh}
                />
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${useKwh ? 'text-white' : 'text-gray-500'}`}>
                    Monthly Usage (kWh)
                  </span>
                  <Zap className="w-5 h-5 text-[#c4ff00]" />
                </div>
              </div>

              {/* Input Field */}
              <div className="space-y-4 mb-6">
                <Label className="text-gray-300">
                  {useKwh ? 'Monthly Electricity Usage' : 'Monthly Electricity Bill'}
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    {useKwh ? <Zap className="w-5 h-5" /> : <IndianRupee className="w-5 h-5" />}
                  </div>
                  <Input
                    type="number"
                    placeholder={useKwh ? 'e.g., 500' : 'e.g., 5000'}
                    value={useKwh ? monthlyKwh : monthlyBill}
                    onChange={(e) =>
                      useKwh
                        ? setMonthlyKwh(e.target.value)
                        : setMonthlyBill(e.target.value)
                    }
                    className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-lg py-6"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    {useKwh ? 'kWh' : '/month'}
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {useKwh
                    ? 'Enter your average monthly electricity consumption in kilowatt-hours'
                    : 'Enter your average monthly electricity bill amount'}
                </p>
              </div>

              {/* Calculate Button */}
              <Button
                onClick={calculateSavings}
                disabled={
                  useKwh
                    ? !monthlyKwh || parseFloat(monthlyKwh) <= 0
                    : !monthlyBill || parseFloat(monthlyBill) <= 0
                }
                className="w-full bg-[#c4ff00] text-black hover:bg-[#d4ff33] py-6 text-lg font-semibold"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Savings
              </Button>

              {/* Assumptions Toggle */}
              <button
                onClick={() => setShowAssumptions(!showAssumptions)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mt-6 text-sm"
              >
                <Info className="w-4 h-4" />
                Calculation Assumptions
                {showAssumptions ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {/* Assumptions */}
              {showAssumptions && settings && (
                <div className="mt-4 p-4 rounded-xl bg-white/5 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Electricity Tariff:</span>
                    <span className="text-white">₹{settings.tariff_per_kwh}/kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Generation per kW:</span>
                    <span className="text-white">{settings.kwh_per_kw_per_month} kWh/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">System Cost:</span>
                    <span className="text-white">₹{formatNumber(settings.system_cost_per_kw)}/kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Government Subsidy:</span>
                    <span className="text-white">{settings.subsidy_percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Maintenance Cost:</span>
                    <span className="text-white">₹{settings.maintenance_cost_per_kw_year}/kW/year</span>
                  </div>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div>
              {results ? (
                <div className="space-y-6">
                  {/* Main Savings Card */}
                  <div className="bg-gradient-to-br from-[#c4ff00]/20 to-[#8bc34a]/20 rounded-3xl p-6 sm:p-8 border border-[#c4ff00]/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#c4ff00]/20 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-[#c4ff00]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Estimated Yearly Savings</h3>
                        <p className="text-gray-400 text-sm">Based on your usage</p>
                      </div>
                    </div>
                    <div className="text-4xl sm:text-5xl font-bold text-[#c4ff00] mb-2">
                      {formatCurrency(results.yearlySavings)}
                    </div>
                    <div className="text-gray-400">
                      That&apos;s{' '}
                      <span className="text-white font-medium">
                        {formatCurrency(results.monthlySavings)}
                      </span>{' '}
                      per month
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/10">
                      <div className="text-gray-400 text-sm mb-1">Recommended System</div>
                      <div className="text-2xl font-bold text-white">
                        {formatNumber(results.recommendedSystemSize)} kW
                      </div>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/10">
                      <div className="text-gray-400 text-sm mb-1">Savings Coverage</div>
                      <div className="text-2xl font-bold text-white">
                        {formatNumber(results.savingsPercentage, 0)}%
                      </div>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/10">
                      <div className="text-gray-400 text-sm mb-1">Payback Period</div>
                      <div className="text-2xl font-bold text-white">
                        {formatNumber(results.paybackPeriod, 1)} years
                      </div>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/10">
                      <div className="text-gray-400 text-sm mb-1">25-Year Savings</div>
                      <div className="text-2xl font-bold text-[#c4ff00]">
                        {formatCurrency(results.twentyFiveYearSavings)}
                      </div>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4">Cost Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">System Cost</span>
                        <span className="text-white">{formatCurrency(results.systemCost)}</span>
                      </div>
                      <div className="flex justify-between text-green-400">
                        <span>Government Subsidy</span>
                        <span>-{formatCurrency(results.subsidyAmount)}</span>
                      </div>
                      <div className="border-t border-white/10 pt-3 flex justify-between">
                        <span className="text-white font-medium">Net Cost</span>
                        <span className="text-[#c4ff00] font-medium">
                          {formatCurrency(results.netCost)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Environmental Impact */}
                  <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <Leaf className="w-5 h-5 text-green-400" />
                      <h3 className="text-lg font-bold text-white">Environmental Impact</h3>
                    </div>
                    <p className="text-gray-400 mb-2">
                      Over 25 years, your solar system will prevent approximately
                    </p>
                    <div className="text-3xl font-bold text-green-400">
                      {formatNumber(results.co2Reduction / 1000, 1)} tonnes
                    </div>
                    <p className="text-gray-400 text-sm">of CO₂ emissions</p>
                  </div>

                  {/* CTA */}
                  <Link to="/contact">
                    <Button className="w-full bg-[#c4ff00] text-black hover:bg-[#d4ff33] py-6 text-lg font-semibold">
                      Get Your Free Quote
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-[#1a1a1a] rounded-3xl p-8 border border-white/10 border-dashed">
                  <div className="text-center">
                    <Calculator className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Ready to Calculate?</h3>
                    <p className="text-gray-400 text-sm">
                      Enter your electricity details and click Calculate to see your potential savings
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
